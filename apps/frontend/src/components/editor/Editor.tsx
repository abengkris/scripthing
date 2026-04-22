import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your screenplay...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none screenplay-editor",
      },
    },
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pt-8 pb-32">
      <div className="bg-white mx-auto shadow-lg min-h-[1056px] w-[816px] p-[1in] screenplay-page border border-gray-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
