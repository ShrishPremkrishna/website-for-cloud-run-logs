import React, { useEffect, useState } from "react";

export default function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hideNoNewEmails, setHideNoNewEmails] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("ALL"); // ALL, INFO, WARNING, ERROR
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setLoading(false);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const newLogs = JSON.parse(event.data);
        if (Array.isArray(newLogs)) {
          setLogs((prevLogs) => [...prevLogs, ...newLogs]);
        }
      } catch (e) {
        console.error("Failed to parse log data:", e);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Connection to log stream failed. Retrying...");
      setLoading(false);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setError("Connection lost. Retrying...");
      setLoading(false);
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Cloud Run Real-Time Logs</h1>
        <div className="flex items-center space-x-4">
          {/* Search Filter */}
          <input
            type="text"
            placeholder="Search logs..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Severity Filter */}
          <div className="flex items-center space-x-2">
            {["ALL", "INFO", "WARNING", "ERROR"].map((level) => (
              <button
                key={level}
                onClick={() => setSeverityFilter(level)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  severityFilter === level
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Checkbox Filter */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hideNoNewEmails}
              onChange={(e) => setHideNoNewEmails(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-300">Hide "No new emails"</span>
          </label>
        </div>
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
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {logs.length > 0 ? (
              logs
                .filter((log) => {
                  // Filter for "No new emails"
                  if (
                    hideNoNewEmails &&
                    log.log.message.includes("No new emails to process.")
                  ) {
                    return false;
                  }

                  // Filter by severity
                  if (
                    severityFilter !== "ALL" &&
                    log.log.severity?.toUpperCase() !== severityFilter
                  ) {
                    return false;
                  }

                  // Filter by search text
                  if (
                    searchFilter &&
                    !log.log.message
                      .toLowerCase()
                      .includes(searchFilter.toLowerCase())
                  ) {
                    return false;
                  }

                  return true;
                })
                .map((log, idx) => {
                  const logData = log.log; // The parsed log object is now in the 'log' property

                  // Define colors for different severities
                  const severityColors = {
                    INFO: "border-blue-500",
                    WARNING: "border-yellow-500",
                    ERROR: "border-red-500",
                    DEFAULT: "border-gray-500",
                  };
                  const borderColor =
                    severityColors[logData.severity?.toUpperCase()] ||
                    severityColors.DEFAULT;

                  return (
                    <div
                      key={idx}
                      className={`font-mono text-sm p-3 rounded-md bg-gray-800 border-l-4 ${borderColor}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-3">
                          <strong
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              {
                                INFO: "bg-blue-900 text-blue-300",
                                WARNING: "bg-yellow-900 text-yellow-300",
                                ERROR: "bg-red-900 text-red-300",
                                DEFAULT: "bg-gray-700 text-gray-300",
                              }[logData.severity?.toUpperCase()] || "bg-gray-700"
                            }`}
                          >
                            {logData.severity || log.severity}
                          </strong>
                          {logData.type === "structured" && (
                            <span className="text-gray-400">
                              {logData.module} ({logData.file}:{logData.line})
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500">
                          {new Date(log.originalTimestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="whitespace-pre-wrap text-gray-300">
                        {logData.message}
                      </pre>
                    </div>
                  );
                })
            ) : (
              <div className="text-gray-500 italic text-center pt-10">
                No logs available yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}