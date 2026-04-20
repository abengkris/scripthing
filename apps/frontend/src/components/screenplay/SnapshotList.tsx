import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export const SnapshotList = ({ scriptId }: { scriptId: string }) => {
  const [snapshots, setSnapshots] = useState([]);

  useEffect(() => {
    api.get(`/scripts/${scriptId}/snapshots`).then(setSnapshots);
  }, [scriptId]);

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="font-bold">Snapshots</h2>
      <ul>
        {snapshots.map((s: any) => (
          <li key={s.id}>{s.label} - {new Date(s.createdAt).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};
