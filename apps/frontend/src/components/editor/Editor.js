import { jsx as _jsx } from "react/jsx-runtime";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ScreenplayExtensions } from "./extensions";
import "./Editor.css";
import { useAutoSave } from "../../hooks/useAutoSave";
import { useParams } from "react-router-dom";
import { useSync } from "../../hooks/useSync";
import { useEditorStore } from "../../store/editorStore";
import { useEffect } from "react";
const Editor = () => {
    const { id } = useParams();
    const autoSave = useAutoSave(id);
    const { initQueue } = useEditorStore();
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
    return (_jsx("div", { className: "flex flex-col h-full bg-gray-50 overflow-y-auto pt-8 pb-32", children: _jsx("div", { className: "bg-white mx-auto shadow-lg min-h-[1056px] w-[816px] p-[1in] screenplay-page border border-gray-200", children: _jsx(EditorContent, { editor: editor }) }) }));
};
export default Editor;
