import React from 'react';

interface ShortcutPanelProps {
  onClose: () => void;
}

const ShortcutPanel: React.FC<ShortcutPanelProps> = ({ onClose }) => {
  const shortcuts = [
    { keys: 'Ctrl/Cmd + 1', action: 'Scene Heading' },
    { keys: 'Ctrl/Cmd + 2', action: 'Action' },
    { keys: 'Ctrl/Cmd + 3', action: 'Character' },
    { keys: 'Ctrl/Cmd + 4', action: 'Parenthetical' },
    { keys: 'Ctrl/Cmd + 5', action: 'Dialogue' },
    { keys: 'Ctrl/Cmd + 6', action: 'Transition' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold">Keyboard Shortcuts</h3>
          <button onClick={onClose}>X</button>
        </div>
        <ul className="text-sm">
          {shortcuts.map(s => (
            <li key={s.keys} className="flex justify-between mb-1">
              <span className="font-mono bg-gray-100 px-1">{s.keys}</span>
              <span>{s.action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShortcutPanel;
