import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import Editor from "../components/editor/Editor";
import SaveStatus from "../components/editor/SaveStatus";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { FileDown } from "lucide-react";
import { ThemeToggle } from "../components/layout/ThemeToggle";
export const EditorPage = () => {
    const { id } = useParams();
    const handleExportPdf = async () => {
        try {
            await api.download(`/api/v1/scripts/${id}/export/pdf`, `script-${id}.pdf`, { method: 'POST' });
        }
        catch (err) {
            console.error("Export failed", err);
        }
    };
    const handleExportFdx = async () => {
        try {
            await api.download(`/api/v1/scripts/${id}/export/fdx`, `script-${id}.fdx`, { method: 'POST' });
        }
        catch (err) {
            console.error("Export failed", err);
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-screen overflow-hidden", children: [_jsxs("header", { className: "h-16 border-b flex items-center px-6 justify-between bg-white shrink-0", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("h1", { className: "text-lg font-semibold text-gray-800", children: ["Editor: ", id] }), _jsx(SaveStatus, {})] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ThemeToggle, {}), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleExportPdf, children: [_jsx(FileDown, { className: "w-4 h-4 mr-2" }), "PDF"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleExportFdx, children: [_jsx(FileDown, { className: "w-4 h-4 mr-2" }), "FDX"] })] })] }), _jsx("main", { className: "flex-1 overflow-hidden", children: _jsx(Editor, {}) })] }));
};
export default EditorPage;
