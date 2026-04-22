#!/bin/bash
# Scripthing SQLite Backup Script
# Usage: ./backup.sh /path/to/data/scripthing.db /path/to/backups/

DB_PATH=$1
BACKUP_DIR=$2
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/scripthing_${TIMESTAMP}.db"

if [ ! -f "$DB_PATH" ]; then
  echo "Error: Database not found at $DB_PATH"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

# Perform backup using sqlite3's atomic .backup command
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"

if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"
  # Optional: Keep only the last 30 days of backups
  find "$BACKUP_DIR" -name "scripthing_*.db" -type f -mtime +30 -delete
else
  echo "Error: Backup failed"
  exit 1
fi
