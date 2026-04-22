# Implementation Plan - Phase 2: Editor & Auto-save

## Phase 1: Tiptap Infrastructure & Nodes
- [x] Task: Set up Tiptap dependencies and base component b30ce50
    - [ ] Install `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`
    - [ ] Create `Editor` component in `apps/frontend/src/components/editor/Editor.tsx`
    - [ ] Integrate `Editor` into the editor route (`apps/frontend/src/routes/editor.$id.tsx`)
- [x] Task: Implement custom screenplay nodes 600c6798
    - [ ] Create `SceneHeading` extension
    - [ ] Create `Action` extension
    - [ ] Create `Character` extension
    - [ ] Create `Dialogue` extension
    - [ ] Create `Parenthetical` extension
    - [ ] Create `Transition` extension
    - [ ] Register all extensions in the Tiptap configuration
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Tiptap Infrastructure & Nodes' (Protocol in workflow.md)

## Phase 2: Screenplay Formatting & Layout
- [ ] Task: Implement auto-format rules (Tab/Enter behavior)
    - [ ] Implement Enter behavior: Character -> Dialogue
    - [ ] Implement Enter behavior: Dialogue -> Action
    - [ ] Implement Enter behavior: Parenthetical -> Dialogue
    - [ ] Implement Tab behavior: Action -> Character
    - [ ] Implement Tab behavior: Dialogue -> Parenthetical
- [ ] Task: Implement keyboard shortcuts for element types
    - [ ] Cmd/Ctrl + 1: Scene Heading
    - [ ] Cmd/Ctrl + 2: Action
    - [ ] Cmd/Ctrl + 3: Character
    - [ ] Cmd/Ctrl + 4: Parenthetical
    - [ ] Cmd/Ctrl + 5: Dialogue
    - [ ] Cmd/Ctrl + 6: Transition
- [ ] Task: Styling for "Page View"
    - [ ] Create CSS for screenplay formatting (margins, alignment, font)
    - [ ] Implement page-like container with shadows and padding
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Screenplay Formatting & Layout' (Protocol in workflow.md)

## Phase 3: Auto-save & Offline Sync
- [ ] Task: Implement IndexedDB persistence for offline queue
    - [ ] Install `idb` or similar for easier IndexedDB access
    - [ ] Create `apps/frontend/src/lib/db.ts` for storage logic
- [ ] Task: Create Auto-save store in Zustand
    - [ ] Implement `useEditorStore` with `isDirty`, `lastSaved`, and `offlineQueue`
    - [ ] Add logic to persist `offlineQueue` to IndexedDB
- [ ] Task: Implement debounced save logic
    - [ ] Create a hook or utility for debounced auto-save (2s)
    - [ ] Integrate save logic with Tiptap's `onUpdate`
- [ ] Task: Implement background sync logic
    - [ ] Create a sync worker or service that retries failed saves when online
    - [ ] Listen for `online` events and window focus
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Auto-save & Offline Sync' (Protocol in workflow.md)

## Phase 4: UI Status Indicator
- [ ] Task: Create Status Indicator component
    - [ ] Implement visual states: "Saving...", "All changes saved", "Offline - Sync pending"
    - [ ] Integrate indicator into the editor layout (status bar)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UI Status Indicator' (Protocol in workflow.md)
