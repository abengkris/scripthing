import React from 'react';
import CharacterReport from './CharacterReport';
import { Editor } from '@tiptap/react';

interface ReportModalProps {
  editor: Editor | null;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ editor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <button onClick={onClose} className="float-right">X</button>
        <CharacterReport editor={editor} />
      </div>
    </div>
  );
};

export default ReportModal;
