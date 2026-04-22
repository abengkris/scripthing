import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Editor from "../Editor";
// Mock Tiptap
vi.mock("@tiptap/react", () => ({
    useEditor: () => ({}),
    EditorContent: () => _jsx("div", { "data-testid": "tiptap-editor" }),
}));
describe("Editor Component", () => {
    it("renders the screenplay page container", () => {
        render(_jsx(Editor, {}));
        const page = screen.getByTestId("tiptap-editor").parentElement;
        expect(page).toBeDefined();
    });
});
