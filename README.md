# Cloud Run Log Viewer

This project provides a simple web interface for viewing the logs of a Google Cloud Run service in real time. It is composed of:

* **backend** – an Express server that streams logs from Google Cloud Logging and serves the compiled frontend
* **frontend** – a React + Tailwind application for displaying the log stream

The app can be run locally or deployed to Cloud Run using Docker.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/)
- A Google Cloud project with Cloud Run enabled
- A service account key with permission to read logs (optional when running on Cloud Run)
- [Docker](https://www.docker.com/) and the [gcloud CLI](https://cloud.google.com/sdk/docs/install) for deployment

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-user/website-for-cloud-run-logs.git
   cd website-for-cloud-run-logs
   ```
2. **Install dependencies**
   ```bash
   npm ci
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and edit the values:
     - `GCP_PROJECT_ID` – your Google Cloud project ID
     - `GCP_KEY_PATH` – path to a service account JSON file (omit when using Cloud Run's service account)
     - `GCP_CLOUD_RUN_SERVICE_NAME` – name of the Cloud Run service whose logs you want to view
     - `PORT` – port for local development (defaults to `8080`)
4. **Build the frontend**
   ```bash
   npm run build
   ```
5. **Start the application**
   ```bash
   npm start
   ```
   Visit `http://localhost:8080` to see the logs.

During development you can use `npm run dev` which runs the backend with `nodemon` and the Vite dev server concurrently.

## Deploying to Cloud Run

1. **Set your Google Cloud project**
   ```bash
   export GCP_PROJECT_ID="your-project-id"
   ```
2. **(Optional) place `service-account.json` in the project root** if you want to use a specific service account.
3. **Deploy**
   ```bash
   ./deploy.sh
   ```
   The script builds the Docker image and deploys it to Cloud Run. When deployment completes, it prints the service URL.

Open the printed URL in your browser to view your logs in the cloud.

## Other Hosting Options

After running `npm run build` you can host the Node application anywhere that can run Node.js. Make sure the environment variables shown above are provided when starting `node backend/index.js`.

## Helpful Files

- [DEPLOYMENT.md](DEPLOYMENT.md) – extra notes on demoing with ngrok and Cloud Run
- [SSE_CLOUD_RUN_FIX.md](SSE_CLOUD_RUN_FIX.md) – background on the WebSocket implementation
