# Specification: Phase 2 - Editor Integration & Auto-save

## Overview
Implement the core screenplay editor using Tiptap, providing industry-standard formatting and a robust auto-save mechanism that works offline.

## Functional Requirements
- **Screenplay Editor**:
    - Integration of Tiptap (ProseMirror-based).
    - Custom nodes for: `SceneHeading`, `Action`, `Character`, `Dialogue`, `Parenthetical`, `Transition`.
    - "Page View" layout with appropriate margins and styling.
- **Formatting Rules**:
    - Auto-format rules for Tab/Enter (e.g., Enter after Character goes to Dialogue).
    - Keyboard shortcuts for switching element types manually.
- **Auto-save Strategy**:
    - Debounced save (2 seconds) after the last keystroke.
    - Offline queue managed via Zustand.
    - Persistence of the offline queue using IndexedDB.
    - Syncing logic that retries when online or on focus.
- **UI/UX**:
    - Status indicator in the editor (e.g., "Saving...", "All changes saved", "Offline - Sync pending").

## Non-Functional Requirements
- **Performance**: Large scripts should remain performant during editing.
- **Reliability**: Data should not be lost if the tab is closed or the network drops.

## Acceptance Criteria
- [ ] Tiptap editor renders with screenplay-specific nodes.
- [ ] Tab/Enter behavior correctly transitions between script elements.
- [ ] Editor styling mimics a professional screenplay page.
- [ ] Changes are saved to the backend automatically after a 2s debounce.
- [ ] If offline, changes are queued in IndexedDB and synced when back online.
- [ ] UI correctly reflects the current save/sync status.

## Out of Scope
- AI integration (Phase 3).
- PDF/FDX Export (Phase 4).
- Multi-user collaboration.
