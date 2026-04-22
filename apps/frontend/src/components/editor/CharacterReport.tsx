import React, { useMemo } from "react";
import { Editor, JSONContent } from "@tiptap/react";

interface CharacterReportProps {
  editor: Editor | null;
}

const CharacterReport: React.FC<CharacterReportProps> = ({ editor }) => {
  const report = useMemo(() => {
    if (!editor) return {};

    const json = editor.getJSON();
    const characterStats: Record<string, number> = {};

    const traverse = (node: JSONContent) => {
      if (node.type === "character") {
        const name =
          node.content?.map((c: JSONContent) => c.text).join("") || "Unknown";
        characterStats[name] = (characterStats[name] || 0) + 1;
      }
      if (node.content) {
        node.content.forEach(traverse);
      }
    };

    traverse(json);
    return characterStats;
  }, [editor]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="font-bold mb-2">Character Appearance Report</h3>
      <ul className="text-sm">
        {Object.entries(report).map(([name, count]) => (
          <li key={name} className="flex justify-between">
            <span>{name}</span>
            <span>{count} scenes</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterReport;
