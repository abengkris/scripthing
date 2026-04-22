import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Editor from "../Editor";

// Mock Tiptap
vi.mock("@tiptap/react", () => ({
  useEditor: () => ({}),
  EditorContent: () => <div data-testid="tiptap-editor" />,
}));

describe("Editor Component", () => {
  it("renders the screenplay page container", () => {
    render(<Editor />);
    const page = screen.getByTestId("tiptap-editor").parentElement;
    expect(page).toBeDefined();
  });
});
