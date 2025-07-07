// backend/index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Logging } = require("@google-cloud/logging");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory (built frontend)
app.use(express.static(path.join(__dirname, "../dist")));

const projectId = process.env.GCP_PROJECT_ID;
const serviceName = process.env.GCP_CLOUD_RUN_SERVICE_NAME;
const keyPath = process.env.GCP_KEY_PATH
  ? path.resolve(process.env.GCP_KEY_PATH)
  : null;

// Create a new Logging client with the service account credentials if provided
const loggingOptions = { projectId };
if (keyPath) {
  loggingOptions.keyFilename = keyPath;
}
const logging = new Logging(loggingOptions);

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected WebSocket clients
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  clients.add(ws);

  // Send a heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000);

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    clients.delete(ws);
    clearInterval(heartbeat);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
    clearInterval(heartbeat);
  });
});

// Function to broadcast logs to all connected clients
function broadcastLogs(logs) {
  const message = JSON.stringify(logs);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Start log streaming
function startLogStream() {
  let filter;
  if (serviceName) {
    // This filter gets ALL logs from a specific service, including requests, stdout, and stderr.
    filter = `resource.type="cloud_run_revision" AND resource.labels.service_name="${serviceName}"`;
  } else {
    // This is the old filter, which only gets request logs from ALL services.
    filter = `logName="projects/${projectId}/logs/run.googleapis.com%2Frequests"`;
  }

  const logStream = logging
    .tailEntries({
      resourceNames: [`projects/${projectId}`],
      filter: filter,
    })
    .on("error", (err) => {
      console.error("Log stream error:", err);
      // Restart stream after delay
      setTimeout(startLogStream, 5000);
    })
    .on("data", (entry) => {
      const logs = (entry.entries || [])
        .map((logEntry) => {
          // The logEntry object from the library is not a plain object.
          // We must serialize and deserialize it to access its properties reliably.
          const plainLogEntry = JSON.parse(JSON.stringify(logEntry));

          // We only care about logs that have a textPayload.
          if (!plainLogEntry.textPayload) {
            return null;
          }

          let timestamp;
          if (plainLogEntry.timestamp && plainLogEntry.timestamp.seconds) {
            timestamp = new Date(
              plainLogEntry.timestamp.seconds * 1000 +
                (plainLogEntry.timestamp.nanos || 0) / 1000000
            );
          } else {
            timestamp = new Date();
          }

          return {
            log: parseLogMessage(plainLogEntry.textPayload),
            originalTimestamp: timestamp.toISOString(),
            severity: plainLogEntry.severity || "DEFAULT",
          };
        })
        .filter(Boolean); // Filter out the logs we don't care about (the nulls).

      if (logs.length > 0) {
        broadcastLogs(logs);
      }
    });
}

// Keep SSE endpoint for backward compatibility
app.get("/logs", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let filter;
  if (serviceName) {
    // This filter gets ALL logs from a specific service, including requests, stdout, and stderr.
    filter = `resource.type="cloud_run_revision" AND resource.labels.service_name="${serviceName}"`;
  } else {
    // This is the old filter, which only gets request logs from ALL services.
    filter = `logName="projects/${projectId}/logs/run.googleapis.com%2Frequests"`;
  }

  const logStream = logging
    .tailEntries({
      resourceNames: [`projects/${projectId}`],
      filter: filter,
    })
    .on("error", (err) => {
      console.error("Log stream error:", err);
      res.end();
    })
    .on("data", (entry) => {
      const logs = (entry.entries || [])
        .map((logEntry) => {
          // The logEntry object from the library is not a plain object.
          // We must serialize and deserialize it to access its properties reliably.
          const plainLogEntry = JSON.parse(JSON.stringify(logEntry));

          // We only care about logs that have a textPayload.
          if (!plainLogEntry.textPayload) {
            return null;
          }

          let timestamp;
          if (plainLogEntry.timestamp && plainLogEntry.timestamp.seconds) {
            timestamp = new Date(
              plainLogEntry.timestamp.seconds * 1000 +
                (plainLogEntry.timestamp.nanos || 0) / 1000000
            );
          } else {
            timestamp = new Date();
          }

          return {
            log: parseLogMessage(plainLogEntry.textPayload),
            originalTimestamp: timestamp.toISOString(),
            severity: plainLogEntry.severity || "DEFAULT",
          };
        })
        .filter(Boolean); // Filter out the logs we don't care about (the nulls).

      if (logs.length > 0) {
        res.write(`data: ${JSON.stringify(logs)}\n\n`);
      }
    });

  req.on("close", () => {
    logStream.destroy();
  });
});

const PORT = process.env.PORT || 5001;
console.log(`Attempting to start server on port: ${PORT}`);

// Start the server
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
  
  // Start log streaming
  startLogStream();
});

// Catch-all handler: send back index.html for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

function parseLogMessage(message) {
  // Regex to capture structured log parts.
  const structuredLogRegex =
    /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) - \[(.+)\] - ([\w\.]+) - \((.+):(\d+)\) - (.*)$/;

  const match = message.match(structuredLogRegex);

  if (match) {
    return {
      type: "structured",
      timestamp: match[1],
      severity: match[2],
      module: match[3],
      file: match[4],
      line: parseInt(match[5], 10),
      message: match[6].trim(),
    };
  }

  // Fallback for unstructured logs (like tracebacks or raw strings)
  return {
    type: "unstructured",
    message: message,
  };
}