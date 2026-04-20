import { useState } from 'react';
import { api } from '../lib/api';

export const AIChat = () => {
  const [analysis, setAnalysis] = useState('');

  const runAnalysis = async () => {
    const result = await api.post('/ai/analyze', {
      provider: 'gemini',
      apiKey: 'your-api-key',
      content: 'Analyze this script.'
    });
    setAnalysis(result.analysis);
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <button onClick={runAnalysis} className="px-4 py-2 bg-blue-500 text-white rounded">Analyze</button>
      {analysis && <p className="mt-2">{analysis}</p>}
    </div>
  );
};
