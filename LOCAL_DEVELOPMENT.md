# 🛠️ Local Development Guide

This guide will help you run and develop the Cloud Run Log Viewer locally.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Cloud CLI** (for service account setup)
- **Docker** (optional, for containerized development)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/cloud-run-log-viewer.git
cd cloud-run-log-viewer

# Install dependencies
npm install

# Set up Google Cloud (if not done already)
npm run setup

# Set environment variables
export GCP_PROJECT_ID="your-project-id"
export GCP_CLOUD_RUN_SERVICE_NAME="your-service-name"

# Start development servers
npm run dev
```

Your application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:backend` | Start only the backend server |
| `npm run frontend` | Start only the frontend development server |
| `npm run frontend:build` | Build the frontend for production |
| `npm start` | Start the production server |
| `npm run setup` | Set up Google Cloud service account |

## Project Structure

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

## Environment Variables

Create a `.env` file in the root directory:

```env
GCP_PROJECT_ID=your-project-id
GCP_CLOUD_RUN_SERVICE_NAME=your-service-name
GCP_KEY_PATH=./service-account.json
PORT=5001
```

## Understanding the Code

### Backend (`backend/index.js`)

The backend handles:
1. **Express Server**: Serves the React app and API endpoints
2. **WebSocket Server**: Real-time communication with frontend
3. **Google Cloud Logging**: Streams logs from your Cloud Run service
4. **Health Check**: `/health` endpoint for monitoring

Key functions:
- `startLogStream()`: Connects to Google Cloud Logging API
- `broadcastLogs()`: Sends logs to all connected WebSocket clients
- `parseLogMessage()`: Parses structured log messages

### Frontend (`frontend/App.jsx`)

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

## Development Workflow

### 1. Making Backend Changes

```bash
# Start backend in development mode (auto-restart on changes)
npm run dev:backend
```

The backend will automatically restart when you make changes to `backend/index.js`.

### 2. Making Frontend Changes

```bash
# Start frontend in development mode (hot reload)
npm run frontend
```

The frontend will hot-reload when you make changes to React components.

### 3. Testing Changes

```bash
# Start both servers
npm run dev

# Test the application
open http://localhost:5173
```

### 4. Building for Production

```bash
# Build the frontend
npm run frontend:build

# Start production server
npm start
```

## Debugging

### Backend Debugging

1. **Check logs**: Backend logs appear in the terminal
2. **Health check**: `curl http://localhost:5001/health`
3. **WebSocket**: Check browser console for connection status

### Frontend Debugging

1. **Browser DevTools**: Check Console and Network tabs
2. **React DevTools**: Install browser extension for React debugging
3. **WebSocket**: Monitor WebSocket connection in Network tab

### Common Issues

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

## Testing

### Manual Testing

1. **Start the app**: `npm run dev`
2. **Open browser**: http://localhost:5173
3. **Generate logs**: Make requests to your Cloud Run service
4. **Verify logs appear**: Check the web interface

### Automated Testing

```bash
# Run health check
curl http://localhost:5001/health

# Check WebSocket connection
# Open browser console and look for "WebSocket connected"
```

## Performance Optimization

### Backend Optimizations

1. **Log Filtering**: Only process relevant logs
2. **Connection Pooling**: Reuse Google Cloud connections
3. **Memory Management**: Clean up old log entries

### Frontend Optimizations

1. **Virtual Scrolling**: For large log volumes
2. **Debounced Search**: Reduce API calls
3. **Log Retention**: Limit displayed logs

## Customization

### Adding New Features

1. **Backend**: Add new endpoints in `backend/index.js`
2. **Frontend**: Create new components in `frontend/`
3. **Styling**: Modify `frontend/index.css`

### Changing Log Format

Modify `parseLogMessage()` in `backend/index.js` to handle different log formats.

### Adding Authentication

1. **Backend**: Add auth middleware
2. **Frontend**: Add login component
3. **WebSocket**: Add authentication to WebSocket connection

## Deployment Testing

### Local Docker Testing

```bash
# Build Docker image
docker build -t cloud-run-log-viewer .

# Run locally
docker run -p 3000:3000 \
  -e GCP_PROJECT_ID=your-project-id \
  -e GCP_CLOUD_RUN_SERVICE_NAME=your-service-name \
  cloud-run-log-viewer
```

### Production Build Testing

```bash
# Build frontend
npm run frontend:build

# Start production server
npm start

# Test at http://localhost:3000
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Make your changes**
4. **Test locally**: `npm run dev`
5. **Commit changes**: `git commit -m "Add feature"`
6. **Push to branch**: `git push origin feature-name`
7. **Create Pull Request**

## Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Google Cloud Logging](https://cloud.google.com/logging/docs)
- [Tailwind CSS](https://tailwindcss.com/docs) 