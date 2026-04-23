import { useEditorStore } from "../../store/editorStore";
import { CloudCheck, CloudUpload, CloudOff, CloudAlert } from "lucide-react";

const SaveStatus = () => {
  const { saveStatus, offlineQueue } = useEditorStore();

  if (offlineQueue.length > 0) {
    return (
      <div
        data-testid="save-status"
        className="flex items-center gap-2 text-amber-600 animate-pulse"
      >
        <CloudUpload size={16} />
        <span className="text-sm font-medium">
          Syncing offline changes ({offlineQueue.length})...
        </span>
      </div>
    );
  }

  switch (saveStatus) {
    case "saving":
      return (
        <div
          data-testid="save-status"
          className="flex items-center gap-2 text-blue-600 animate-pulse"
        >
          <CloudUpload size={16} />
          <span className="text-sm font-medium">Saving...</span>
        </div>
      );
    case "saved":
      return (
        <div
          data-testid="save-status"
          className="flex items-center gap-2 text-green-600"
        >
          <CloudCheck size={16} />
          <span className="text-sm font-medium">All changes saved</span>
        </div>
      );
    case "error":
      return (
        <div
          data-testid="save-status"
          className="flex items-center gap-2 text-red-600"
        >
          <CloudAlert size={16} />
          <span className="text-sm font-medium">Error saving changes</span>
        </div>
      );
    case "offline":
      return (
        <div
          data-testid="save-status"
          className="flex items-center gap-2 text-gray-500"
        >
          <CloudOff size={16} />
          <span className="text-sm font-medium">Offline</span>
        </div>
      );
    default:
      return null;
  }
};

export default SaveStatus;
