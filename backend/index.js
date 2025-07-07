// backend/index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Logging } = require("@google-cloud/logging");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const projectId = process.env.GCP_PROJECT_ID;
const serviceName = process.env.GCP_CLOUD_RUN_SERVICE_NAME;
const keyPath = path.resolve(process.env.GCP_KEY_PATH);

// Create a new Logging client with the service account credentials
const logging = new Logging({
  projectId,
  keyFilename: keyPath,
});

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
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
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