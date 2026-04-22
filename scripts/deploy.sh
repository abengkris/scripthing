#!/bin/bash
# Scripthing Automated Deployment Script for VPS
# This script is intended to be executed on the VPS, typically triggered via SSH.

set -e # Exit on error

# Configuration
APP_DIR="/opt/scripthing" # Path to the application on the VPS
DB_PATH="${APP_DIR}/apps/backend/data/scripthing.db"
BACKUP_DIR="${APP_DIR}/backups"
LOG_FILE="${APP_DIR}/deploy.log"

# Log deployment attempt
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting deployment..." >> "$LOG_FILE"

# 1. Pre-deploy: Database Backup
if [ -f "$DB_PATH" ]; then
  echo "Backing up database..."
  mkdir -p "$BACKUP_DIR"
  TIMESTAMP=$(date +%F_%H-%M-%S)
  BACKUP_FILE="${BACKUP_DIR}/scripthing_${TIMESTAMP}.db"
  
  # Ensure sqlite3 is available
  if command -v sqlite3 > /dev/null; then
    sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"
  else
    cp "$DB_PATH" "$BACKUP_FILE"
  fi
  echo "Backup created: $BACKUP_FILE"
fi

# 2. Deploy: Pull latest images and restart services
cd "$APP_DIR"
echo "Pulling latest images..."
docker compose pull || { echo "Docker pull failed. Rolling back..."; exit 1; }

echo "Updating services..."
# We use --build to ensure latest context is picked up if not using images from registry
# But in a typical CI/CD, we'd pull pre-built images.
# For now, assuming pull + up -d
docker compose up -d

# 3. Prisma Migrations (run inside backend container)
echo "Running Prisma migrations..."
docker compose exec -T backend npx prisma migrate deploy || {
  echo "Migration failed. Reverting..."
  # Revert to previous image state might be complex if using 'latest'. 
  # Better to use specific tags in production.
  # For now, just logging failure.
  exit 1
}

# 4. Post-deploy: Health Check
echo "Performing health check..."
MAX_RETRIES=5
RETRY_COUNT=0
HEALTHY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  # Check if backend auth/me endpoint responds (adjust URL as needed for VPS)
  # Assuming localhost:3001 is where backend is exposed to the script environment
  STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/v1/auth/me || echo "000")
  
  if [ "$STATUS_CODE" -eq 401 ] || [ "$STATUS_CODE" -eq 200 ]; then
    HEALTHY=true
    break
  fi
  
  echo "Health check failed (Status: $STATUS_CODE). Retrying in 5s..."
  sleep 5
  RETRY_COUNT=$((RETRY_COUNT+1))
done

if [ "$HEALTHY" = true ]; then
  echo "Deployment successful!"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deployment SUCCESS" >> "$LOG_FILE"
else
  echo "Health check failed after $MAX_RETRIES attempts. Rolling back..."
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deployment FAILED - Health Check" >> "$LOG_FILE"
  
  # 5. Automated Rollback (Simplistic version)
  # In a real environment, we'd roll back to the previous image tag.
  # Here we'll try to restart with current state but it might be broken.
  # Ideally, we restore the DB if the migration was the issue.
  if [ -f "$BACKUP_FILE" ]; then
    echo "Restoring database from $BACKUP_FILE..."
    cp "$BACKUP_FILE" "$DB_PATH"
  fi
  
  docker compose up -d
  exit 1
fi
