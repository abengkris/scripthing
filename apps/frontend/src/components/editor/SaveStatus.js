import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEditorStore } from "../../store/editorStore";
import { CloudCheck, CloudUpload, CloudOff, CloudAlert } from "lucide-react";
const SaveStatus = () => {
    const { saveStatus, offlineQueue } = useEditorStore();
    if (offlineQueue.length > 0) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-amber-600 animate-pulse", children: [_jsx(CloudUpload, { size: 16 }), _jsxs("span", { className: "text-sm font-medium", children: ["Syncing offline changes (", offlineQueue.length, ")..."] })] }));
    }
    switch (saveStatus) {
        case "saving":
            return (_jsxs("div", { className: "flex items-center gap-2 text-blue-600 animate-pulse", children: [_jsx(CloudUpload, { size: 16 }), _jsx("span", { className: "text-sm font-medium", children: "Saving..." })] }));
        case "saved":
            return (_jsxs("div", { className: "flex items-center gap-2 text-green-600", children: [_jsx(CloudCheck, { size: 16 }), _jsx("span", { className: "text-sm font-medium", children: "All changes saved" })] }));
        case "error":
            return (_jsxs("div", { className: "flex items-center gap-2 text-red-600", children: [_jsx(CloudAlert, { size: 16 }), _jsx("span", { className: "text-sm font-medium", children: "Error saving changes" })] }));
        case "offline":
            return (_jsxs("div", { className: "flex items-center gap-2 text-gray-500", children: [_jsx(CloudOff, { size: 16 }), _jsx("span", { className: "text-sm font-medium", children: "Offline" })] }));
        default:
            return null;
    }
};
export default SaveStatus;
