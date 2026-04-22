import { useParams } from "react-router-dom";
import Editor from "../components/editor/Editor";
import SaveStatus from "../components/editor/SaveStatus";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { FileDown } from "lucide-react";

import { ThemeToggle } from "../components/layout/ThemeToggle";

export const EditorPage = () => {
  const { id } = useParams<{ id: string }>();

  const handleExportPdf = async () => {
    try {
      await api.download(`/api/v1/scripts/${id}/export/pdf`, `script-${id}.pdf`, { method: 'POST' });
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const handleExportFdx = async () => {
    try {
      await api.download(`/api/v1/scripts/${id}/export/fdx`, `script-${id}.fdx`, { method: 'POST' });
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b flex items-center px-6 justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-800">Editor: {id}</h1>
          <SaveStatus />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleExportPdf}>
            <FileDown className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportFdx}>
            <FileDown className="w-4 h-4 mr-2" />
            FDX
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Editor />
      </main>
    </div>
  );
};

export default EditorPage;
