'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [prompt, setPrompt] = useState('Trigonometry');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('Sending request to API...');
      
      const res = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log('Response data:', data);
      setResponse(data);

    } catch (err) {
      console.error('API test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI API Test</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Test Prompt:
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              placeholder="Enter what you want to learn..."
            />
          </div>

          <button
            onClick={testAPI}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Testing API...' : 'Test AI API'}
          </button>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <h3 className="font-semibold text-red-300 mb-2">Error:</h3>
              <pre className="text-red-200 text-sm whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {response && (
            <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg">
              <h3 className="font-semibold text-green-300 mb-2">Response:</h3>
              <pre className="text-green-200 text-sm whitespace-pre-wrap overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-slate-800 rounded-lg">
            <h3 className="font-semibold mb-2">API Endpoint Info:</h3>
            <p className="text-gray-300 text-sm">
              <strong>URL:</strong> /api/test-ai<br/>
              <strong>Method:</strong> POST<br/>
              <strong>Body:</strong> {`{"prompt": "${prompt}"}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
