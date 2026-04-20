# Specification: Frontend Scaffolding

## Overview
Scaffold the frontend React application using Vite, TypeScript, and the defined project tech stack. Set up folder structures, necessary dependencies, and essential configuration for development.

## Functional Requirements
- Initialize Vite project (React + TS)
- Configure path aliases (@/)
- Install and configure React Router, Zustand, React Query, and TailwindCSS
- Initialize folder structure and placeholder files
- Configure Axios API client with interceptors
- Setup global state and routing providers

## Non-Functional Requirements
- Strictly follow the project's monorepo structure
- Ensure 0 errors for `tsc --noEmit`
- Successful build via `npm run build`

## Acceptance Criteria
1. The app starts successfully at http://localhost:5173
2. `tsc --noEmit` passes with 0 errors
3. `npm run build` successfully generates `dist/`
4. `@/` path aliases resolve correctly
