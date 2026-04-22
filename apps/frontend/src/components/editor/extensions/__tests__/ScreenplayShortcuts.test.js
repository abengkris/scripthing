import { describe, it, expect, vi } from "vitest";
import { ScreenplayShortcuts } from "../ScreenplayShortcuts";
describe("ScreenplayShortcuts Extension", () => {
    it("should have correct keyboard shortcuts", () => {
        const mockContext = {
            editor: {
                commands: {
                    setNode: vi.fn(),
                },
            },
        };
        // Use a double cast to avoid eslint any warning while still allowing the call
        const shortcuts = ScreenplayShortcuts.config.addKeyboardShortcuts?.call(mockContext);
        expect(shortcuts).toBeDefined();
        if (shortcuts) {
            expect(shortcuts["Mod-1"]).toBeDefined();
            expect(shortcuts["Mod-2"]).toBeDefined();
            expect(shortcuts["Mod-3"]).toBeDefined();
            expect(shortcuts["Mod-4"]).toBeDefined();
            expect(shortcuts["Mod-5"]).toBeDefined();
            expect(shortcuts["Mod-6"]).toBeDefined();
        }
    });
});
