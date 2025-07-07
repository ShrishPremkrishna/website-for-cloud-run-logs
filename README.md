# 🌐 Cloud Run Log Viewer

A beautiful, real-time web interface for viewing Google Cloud Run logs. This application provides instant access to your Cloud Run service logs with search, filtering, and a modern dark theme interface.

![Cloud Run Log Viewer](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)

## ✨ Features

- 🔄 **Real-time log streaming** via WebSockets
- 🔍 **Search and filter** logs by content and severity
- 🎨 **Beautiful dark theme** interface
- 📱 **Responsive design** works on all devices
- ⚡ **Auto-reconnection** when connection is lost
- 🚀 **One-click deployment** to Google Cloud Run
- 💰 **Cost-effective** with proper Cloud Run scaling

## 🚀 Quick Start (5 minutes)

### Prerequisites

Before you begin, make sure you have:

1. **Google Cloud Account** with billing enabled
2. **Google Cloud CLI** installed ([install here](https://cloud.google.com/sdk/docs/install))
3. **Docker** installed ([install here](https://docs.docker.com/get-docker/))
4. **Node.js** installed ([install here](https://nodejs.org/))

### Step 1: Clone and Setup

```bash
# Clone this repository
git clone https://github.com/ShrishPremkrishna/website-for-cloud-run-logs.git
cd website-for-cloud-run-logs

# Install dependencies
npm install
```

### Step 2: Configure Google Cloud

```bash
# Login to Google Cloud
gcloud auth login

# Set up your service account (this will guide you through the process)
npm run setup
```

This script will:
- Create a service account with the necessary permissions
- Download the service account key file
- Set up your project configuration

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your values
nano .env  # or use your preferred editor
```

Update the `.env` file with your actual values:

```env
GCP_PROJECT_ID=your-actual-project-id
GCP_CLOUD_RUN_SERVICE_NAME=your-actual-service-name
GCP_KEY_PATH=./service-account.json
PORT=3000
```

### Step 4: Deploy to Cloud Run

```bash
# Deploy with one command
npm run deploy
```

That's it! Your log viewer will be available at the URL shown in the output.

## 📖 Detailed Guide

<details>
<summary><strong>🔧 What This Application Does</strong></summary>

This is a **full-stack web application** that:

1. **Backend (Node.js/Express)**: 
   - Connects to Google Cloud Logging API
   - Streams logs in real-time using WebSockets
   - Serves the React frontend
   - Filters logs by your specified Cloud Run service

2. **Frontend (React + Tailwind CSS)**:
   - Displays logs in real-time with a beautiful interface
   - Provides search and filtering capabilities
   - Auto-reconnects if the connection is lost
   - Responsive design for all devices

3. **Deployment (Docker + Cloud Run)**:
   - Containerized for easy deployment
   - Optimized for Cloud Run's scaling model
   - Includes proper error handling and health checks

</details>

<details>
<summary><strong>🏗️ Understanding the Architecture</strong></summary>

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Your Browser  │◄──►│  Cloud Run App   │◄──►│ Google Cloud    │
│   (Frontend)    │    │  (Backend)       │    │   Logging API   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  WebSocket       │
                       │  Connection      │
                       └──────────────────┘
```

</details>

<details>
<summary><strong>🔧 Local Development</strong></summary>

To run the application locally for development:

```bash
# Start both frontend and backend in development mode
npm run dev
```

This will start:
- Backend server on `http://localhost:5001`
- Frontend development server on `http://localhost:5173`
- Hot reloading for both frontend and backend

### Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:backend` | Start only the backend server |
| `npm run frontend` | Start only the frontend development server |
| `npm run frontend:build` | Build the frontend for production |
| `npm start` | Start the production server |
| `npm run setup` | Set up Google Cloud service account |

### Project Structure

```
cloud-run-log-viewer/
├── backend/
│   └── index.js          # Express server + WebSocket + Log streaming
├── frontend/
│   ├── App.jsx           # Main React component
│   ├── index.jsx         # React entry point
│   ├── index.html        # HTML template
│   └── index.css         # Tailwind CSS styles
├── scripts/
│   └── setup-service-account.sh  # Google Cloud setup script
├── dist/                 # Built frontend (generated)
├── package.json          # Dependencies and scripts
├── Dockerfile           # Container configuration
├── deploy.sh            # Deployment script
└── README.md            # This file
```

### Understanding the Code

#### Backend (`backend/index.js`)

The backend handles:
1. **Express Server**: Serves the React app and API endpoints
2. **WebSocket Server**: Real-time communication with frontend
3. **Google Cloud Logging**: Streams logs from your Cloud Run service
4. **Health Check**: `/health` endpoint for monitoring

Key functions:
- `startLogStream()`: Connects to Google Cloud Logging API
- `broadcastLogs()`: Sends logs to all connected WebSocket clients
- `parseLogMessage()`: Parses structured log messages

#### Frontend (`frontend/App.jsx`)

The frontend provides:
1. **WebSocket Connection**: Real-time log streaming
2. **Search & Filtering**: Find specific logs
3. **Severity Filtering**: Filter by INFO, WARNING, ERROR
4. **Auto-reconnection**: Handles connection drops

Key features:
- Real-time log display
- Search functionality
- Severity-based filtering
- Responsive design

### Development Workflow

#### 1. Making Backend Changes

```bash
# Start backend in development mode (auto-restart on changes)
npm run dev:backend
```

The backend will automatically restart when you make changes to `backend/index.js`.

#### 2. Making Frontend Changes

```bash
# Start frontend in development mode (hot reload)
npm run frontend
```

The frontend will hot-reload when you make changes to React components.

#### 3. Testing Changes

```bash
# Start both servers
npm run dev

# Test the application
open http://localhost:5173
```

#### 4. Building for Production

```bash
# Build the frontend
npm run frontend:build

# Start production server
npm start
```

### Debugging

#### Backend Debugging

1. **Check logs**: Backend logs appear in the terminal
2. **Health check**: `curl http://localhost:5001/health`
3. **WebSocket**: Check browser console for connection status

#### Frontend Debugging

1. **Browser DevTools**: Check Console and Network tabs
2. **React DevTools**: Install browser extension for React debugging
3. **WebSocket**: Monitor WebSocket connection in Network tab

#### Common Issues

1. **"Service account not found"**
   ```bash
   npm run setup
   ```

2. **"Permission denied"**
   ```bash
   gcloud auth login
   ```

3. **"No logs appearing"**
   - Check your Cloud Run service is running
   - Verify service name is correct
   - Check service account permissions

4. **"Connection lost"**
   - Normal behavior, app will auto-reconnect
   - Check backend is running
   - Verify WebSocket URL

### Testing

#### Manual Testing

1. **Start the app**: `npm run dev`
2. **Open browser**: http://localhost:5173
3. **Generate logs**: Make requests to your Cloud Run service
4. **Verify logs appear**: Check the web interface

#### Automated Testing

```bash
# Run health check
curl http://localhost:5001/health

# Check WebSocket connection
# Open browser console and look for "WebSocket connected"
```

### Performance Optimization

#### Backend Optimizations

1. **Log Filtering**: Only process relevant logs
2. **Connection Pooling**: Reuse Google Cloud connections
3. **Memory Management**: Clean up old log entries

#### Frontend Optimizations

1. **Virtual Scrolling**: For large log volumes
2. **Debounced Search**: Reduce API calls
3. **Log Retention**: Limit displayed logs

### Customization

#### Adding New Features

1. **Backend**: Add new endpoints in `backend/index.js`
2. **Frontend**: Create new components in `frontend/`
3. **Styling**: Modify `frontend/index.css`

#### Changing Log Format

Modify `parseLogMessage()` in `backend/index.js` to handle different log formats.

#### Adding Authentication

1. **Backend**: Add auth middleware
2. **Frontend**: Add login component
3. **WebSocket**: Add authentication to WebSocket connection

### Deployment Testing

#### Local Docker Testing

```bash
# Build Docker image
docker build -t cloud-run-log-viewer .

# Run locally
docker run -p 3000:3000 \
  -e GCP_PROJECT_ID=your-project-id \
  -e GCP_CLOUD_RUN_SERVICE_NAME=your-service-name \
  cloud-run-log-viewer
```

#### Production Build Testing

```bash
# Build frontend
npm run frontend:build

# Start production server
npm start

# Test at http://localhost:3000
```

</details>

<details>
<summary><strong>⚙️ Environment Variables Explained</strong></summary>

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GCP_PROJECT_ID` | Your Google Cloud project ID | Yes | `my-project-123` |
| `GCP_CLOUD_RUN_SERVICE_NAME` | Name of the Cloud Run service to monitor | Yes | `my-api-service` |
| `GCP_KEY_PATH` | Path to service account key file | Yes | `/app/service-account.json` |
| `PORT` | Port for local development | No | `3000` |

</details>

<details>
<summary><strong>🚀 Deployment Options</strong></summary>

### Option 1: Google Cloud Run (Recommended)

The easiest way to deploy is using the provided script:

```bash
npm run deploy
```

This will:
- Build a Docker image
- Push it to Google Container Registry
- Deploy to Cloud Run with proper configuration
- Set up auto-scaling and CPU allocation

#### Manual Deploy

```bash
# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push Docker image
docker buildx build --platform linux/amd64 -t gcr.io/$PROJECT_ID/cloud-run-log-viewer:latest --push .

# Deploy to Cloud Run
gcloud run deploy cloud-run-log-viewer \
  --image gcr.io/$PROJECT_ID/cloud-run-log-viewer:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GCP_PROJECT_ID=$PROJECT_ID,GCP_CLOUD_RUN_SERVICE_NAME=$GCP_CLOUD_RUN_SERVICE_NAME,GCP_KEY_PATH=/app/service-account.json" \
  --memory 512Mi \
  --cpu 1 \
  --cpu-boost \
  --min-instances 1 \
  --max-instances 10
```

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GCP_PROJECT_ID` | Your Google Cloud project ID | Yes | `my-project-123` |
| `GCP_CLOUD_RUN_SERVICE_NAME` | Name of the Cloud Run service to monitor | Yes | `my-api-service` |
| `GCP_KEY_PATH` | Path to service account key file | Yes | `/app/service-account.json` |
| `PORT` | Port for local development | No | `3000` |

### Service Account Setup

For all deployment options, you need a Google Cloud service account:

```bash
# Run the setup script
npm run setup

# This will create:
# - Service account with proper permissions
# - service-account.json file
# - Required IAM bindings
```

### Cost Considerations

#### Google Cloud Run
- **Min 1 instance**: ~$17-20/month
- **Max 10 instances**: Prevents runaway costs
- **CPU allocation**: Optimized for performance

#### Other Platforms
- **Railway**: Pay-per-use, starts at $5/month
- **Render**: Free tier available, then $7/month
- **Heroku**: Free tier discontinued, starts at $7/month
- **Vercel**: Generous free tier

### Security Best Practices

1. **Service Account**: Use minimal required permissions
2. **HTTPS**: All platforms provide HTTPS by default
3. **Authentication**: Consider adding auth for production
4. **Key Management**: Never commit service account keys
5. **Environment Variables**: Use platform secrets management

</details>

<details>
<summary><strong>🔧 Troubleshooting</strong></summary>

#### Common Issues

1. **"Service account not found"**
   ```bash
   # Run the setup script again
   npm run setup
   ```

2. **"Permission denied"**
   ```bash
   # Check authentication
   gcloud auth list
   
   # Re-authenticate if needed
   gcloud auth login
   ```

3. **"No logs appearing"**
   - Verify your Cloud Run service name is correct
   - Check that your service is actually running
   - Ensure the service account has proper permissions

4. **"Connection lost"**
   - This is normal behavior, the app will auto-reconnect
   - Check your internet connection
   - Verify the Cloud Run service is running
   - You might need to setup minimum scaling in your cloud run container to 1 so that this website stays live constantly.

</details>

<details>
<summary><strong>🔒 Security Considerations</strong></summary>

1. **Service Account**: The application uses a service account with minimal required permissions
2. **HTTPS**: Cloud Run provides HTTPS by default
3. **Authentication**: Consider adding authentication for production use
4. **Key Management**: Never commit `service-account.json` to version control

</details>

<details>
<summary><strong>💰 Cost Optimization</strong></summary>

- **Min Instances**: Set to 1 to keep the connection alive (~$17-20/month)
- **Max Instances**: Limited to 10 to prevent runaway costs
- **CPU Allocation**: Uses CPU boost for better performance
- **Memory**: Optimized to 512Mi for cost efficiency

</details>

## 🛠️ Customization

<details>
<summary><strong>🔄 Changing the Target Service</strong></summary>

To monitor a different Cloud Run service:

```bash
# Update your .env file
GCP_CLOUD_RUN_SERVICE_NAME=your-new-service-name

# Redeploy
npm run deploy
```

</details>

<details>
<summary><strong>🎨 Modifying the UI</strong></summary>

The frontend is built with React and Tailwind CSS. Key files:

- `frontend/App.jsx`: Main application component
- `frontend/index.css`: Styling with Tailwind
- `backend/index.js`: Backend API and WebSocket server

</details>

<details>
<summary><strong>🔐 Adding Authentication</strong></summary>

For production use, consider adding authentication:

1. **Google OAuth**: Use Google Cloud Identity
2. **API Keys**: Implement API key authentication
3. **Custom Auth**: Add your own authentication system

</details>

## 📚 Learning Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Google Cloud Logging API](https://cloud.google.com/logging/docs)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.