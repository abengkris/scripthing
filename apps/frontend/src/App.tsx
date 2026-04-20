import { ScreenplayEditor } from './editor/ScreenplayEditor';
import { SnapshotList } from './components/screenplay/SnapshotList';
import { AIChat } from './ai/AIChat';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Scripthing Editor</h1>
      <AIChat />
      <ScreenplayEditor />
      <SnapshotList scriptId="1" />
    </div>
  );
}
