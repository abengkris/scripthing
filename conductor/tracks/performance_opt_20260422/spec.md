# Specification: Performance Optimization (Phase 7)

## Overview
Optimize application performance by implementing lazy loading, virtual scrolling, database pagination, and bundle size reduction, targeting 60fps performance and faster load times.

## Functional Requirements
- **Lazy Loading**: Use React.lazy for non-critical code (AI sidebar, settings page).
- **Virtual Scrolling**: Implement TanStack Virtual for long screenplays in the editor.
- **Database Pagination**: Implement offset-based pagination on backend endpoints (e.g., projects, scripts lists).
- **Bundle Optimization**: Configure Vite to optimize bundle sizes (code splitting, tree shaking).

## Non-Functional Requirements
- Maintain 60fps interaction in the editor.
- Improve initial page load time.
- API response times for lists should remain stable even with high data volume.

## Acceptance Criteria
- [ ] Editor components and Sidebar are lazy-loaded.
- [ ] TanStack Virtual integrated for long scripts.
- [ ] Projects/Scripts list endpoints support offset-based pagination.
- [ ] Vite build output analysis indicates bundle size reduction.

## Out of Scope
- Performance optimization of the underlying SQLite database engine.
- GPU-accelerated rendering.
