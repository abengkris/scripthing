import { useParams } from "react-router-dom";
import Editor from "../components/editor/Editor";
import SaveStatus from "../components/editor/SaveStatus";

export const EditorPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b flex items-center px-6 justify-between bg-white shrink-0">
        <h1 className="text-lg font-semibold text-gray-800">Editor: {id}</h1>
        <SaveStatus />
      </header>
      <main className="flex-1 overflow-hidden">
        <Editor />
      </main>
    </div>
  );
};

export default EditorPage;
