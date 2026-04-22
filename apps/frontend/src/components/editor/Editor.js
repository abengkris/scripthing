import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useVirtualizer } from '@tanstack/react-virtual';
import { ScreenplayExtensions } from "./extensions";
import "./Editor.css";
import { useAutoSave } from "../../hooks/useAutoSave";
import { useParams } from "react-router-dom";
import { useSync } from "../../hooks/useSync";
import { useEditorStore } from "../../store/editorStore";
import { useEffect, useRef } from "react";
import WordCount from "./WordCount";
const Editor = () => {
    const { id } = useParams();
    const autoSave = useAutoSave(id);
    const { initQueue } = useEditorStore();
    const parentRef = useRef(null);
    useSync(); // Background sync
    useEffect(() => {
        initQueue();
    }, [initQueue]);
    const editor = useEditor({
        extensions: [StarterKit, ...ScreenplayExtensions],
        content: "<p>Start writing your screenplay...</p>",
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            autoSave(json);
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none screenplay-editor",
            },
        },
    });
    const rowVirtualizer = useVirtualizer({
        count: 1, // Single page virtualization for now
        getScrollElement: () => parentRef.current,
        estimateSize: () => 1056, // Estimate size for a full screenplay page
    });
    return (_jsx("div", { ref: parentRef, "data-testid": "editor-container", className: "flex flex-col h-full bg-gray-50 overflow-y-auto pt-8 pb-32", children: _jsx("div", { style: { height: `${rowVirtualizer.getTotalSize()}px` }, className: "relative", children: rowVirtualizer.getVirtualItems().map(virtualRow => (_jsxs("div", { style: { position: 'absolute', top: 0, left: 0, width: '100%', height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }, children: [_jsx("div", { className: "bg-white mx-auto shadow-lg min-h-[1056px] w-[816px] p-[1in] screenplay-page border border-gray-200", children: _jsx(EditorContent, { editor: editor }) }), _jsx(WordCount, { editor: editor })] }, virtualRow.key))) }) }));
};
export default Editor;
