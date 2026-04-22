import React, { useState } from 'react';
import { Editor } from '@tiptap/react';

interface FindReplaceProps {
  editor: Editor | null;
  onClose: () => void;
}

const FindReplace: React.FC<FindReplaceProps> = ({ editor, onClose }) => {
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');

  const handleReplaceAll = () => {
    if (!editor) return;
    
    const content = editor.getHTML();
    const regex = new RegExp(find, 'gi');
    const newContent = content.replace(regex, replace);
    editor.commands.setContent(newContent);
  };

  return (
    <div className="fixed top-16 right-4 bg-white p-4 border border-gray-200 rounded shadow-lg z-50">
      <div className="flex justify-between mb-2">
        <h4 className="font-bold">Find & Replace</h4>
        <button onClick={onClose}>X</button>
      </div>
      <input 
        className="block w-full mb-2 p-1 border"
        placeholder="Find"
        value={find}
        onChange={(e) => setFind(e.target.value)}
      />
      <input 
        className="block w-full mb-2 p-1 border"
        placeholder="Replace"
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
      />
      <button 
        className="w-full bg-blue-500 text-white p-1 rounded"
        onClick={handleReplaceAll}
      >
        Replace All
      </button>
    </div>
  );
};

export default FindReplace;
