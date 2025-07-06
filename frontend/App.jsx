import React, { useEffect, useState } from "react";

export default function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5001/logs");

    eventSource.onopen = () => {
      setLoading(false);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const newLogs = JSON.parse(event.data);
        if (Array.isArray(newLogs)) {
          setLogs((prevLogs) => [...prevLogs, ...newLogs]);
        }
      } catch (e) {
        console.error("Failed to parse log data:", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setError("Connection to log stream failed. Retrying...");
      setLoading(false);
      eventSource.close();
      // Optional: implement a reconnect logic here
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 p-4 shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold">Cloud Run Real-Time Logs</h1>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {loading && (
          <div className="text-center py-10 text-gray-400">Connecting to log stream...</div>
        )}

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-black rounded-md shadow overflow-hidden">
          <pre className="whitespace-pre-wrap p-4 text-sm text-gray-300 h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} className="mb-4 border-l-4 border-blue-500 pl-2">
                  <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <strong className="ml-2 text-yellow-400">{log.severity}</strong>
                  <div className="mt-1 whitespace-pre-line">{log.log}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No logs available yet.</div>
            )}
          </pre>
        </div>
      </main>
    </div>
  );
}