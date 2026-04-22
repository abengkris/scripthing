import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import Editor from "../components/editor/Editor";
import SaveStatus from "../components/editor/SaveStatus";
export const EditorPage = () => {
    const { id } = useParams();
    return (_jsxs("div", { className: "flex flex-col h-screen overflow-hidden", children: [_jsxs("header", { className: "h-16 border-b flex items-center px-6 justify-between bg-white shrink-0", children: [_jsxs("h1", { className: "text-lg font-semibold text-gray-800", children: ["Editor: ", id] }), _jsx(SaveStatus, {})] }), _jsx("main", { className: "flex-1 overflow-hidden", children: _jsx(Editor, {}) })] }));
};
export default EditorPage;
