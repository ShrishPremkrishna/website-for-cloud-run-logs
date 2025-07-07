# 🌐 Cloud Run Log Viewer

A beautiful, real-time web interface for viewing Google Cloud Run logs. This application provides instant access to your Cloud Run service logs with search, filtering, and a modern dark theme interface.

![Cloud Run Log Viewer](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)
![License](https://img.shields.io/badge/License-ISC-blue)

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
git clone https://github.com/yourusername/cloud-run-log-viewer.git
cd cloud-run-log-viewer

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

```bash
# Set your Google Cloud project ID
export GCP_PROJECT_ID="your-project-id"

# Set the Cloud Run service name you want to monitor
export GCP_CLOUD_RUN_SERVICE_NAME="your-service-name"
```

### Step 4: Deploy to Cloud Run

```bash
# Deploy with one command
npm run deploy
```

That's it! Your log viewer will be available at the URL shown in the output.

## 📖 Detailed Guide

### What This Application Does

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

### Understanding the Architecture

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

### Local Development

To run the application locally for development:

```bash
# Start both frontend and backend in development mode
npm run dev
```

This will start:
- Backend server on `http://localhost:5001`
- Frontend development server on `http://localhost:5173`
- Hot reloading for both frontend and backend

### Environment Variables Explained

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GCP_PROJECT_ID` | Your Google Cloud project ID | Yes | `my-project-123` |
| `GCP_CLOUD_RUN_SERVICE_NAME` | Name of the Cloud Run service to monitor | Yes | `my-api-service` |
| `GCP_KEY_PATH` | Path to service account key file | Yes | `/app/service-account.json` |
| `PORT` | Port for local development | No | `3000` |

### Deployment Options

#### Option 1: Google Cloud Run (Recommended)

The easiest way to deploy is using the provided script:

```bash
npm run deploy
```

This will:
- Build a Docker image
- Push it to Google Container Registry
- Deploy to Cloud Run with proper configuration
- Set up auto-scaling and CPU allocation

#### Option 2: Other Platforms

You can also deploy to other platforms that support Docker:

- **Railway**: Connect your GitHub repo and deploy
- **Render**: Use the Docker deployment option
- **Heroku**: Use the container deployment
- **Vercel**: Deploy the frontend separately

### Troubleshooting

#### Common Issues

1. **"Service account not found"**
   ```bash
   # Run the setup script again
   npm run setup
   ```

2. **"Permission denied"**
   ```bash
   # Make sure you're logged in
   gcloud auth login
   
   # Check your project
   gcloud config get-value project
   ```

3. **"No logs appearing"**
   - Verify your Cloud Run service name is correct
   - Check that your service is actually running
   - Ensure the service account has proper permissions

4. **"Connection lost"**
   - This is normal behavior, the app will auto-reconnect
   - Check your internet connection
   - Verify the Cloud Run service is running

#### Checking Logs

```bash
# View Cloud Run logs
gcloud run logs read --service=cloud-run-log-viewer

# Check application health
curl https://your-app-url/health
```

### Security Considerations

1. **Service Account**: The application uses a service account with minimal required permissions
2. **HTTPS**: Cloud Run provides HTTPS by default
3. **Authentication**: Consider adding authentication for production use
4. **Key Management**: Never commit `service-account.json` to version control

### Cost Optimization

- **Min Instances**: Set to 1 to keep the connection alive (~$17-20/month)
- **Max Instances**: Limited to 10 to prevent runaway costs
- **CPU Allocation**: Uses CPU boost for better performance
- **Memory**: Optimized to 512Mi for cost efficiency

## 🛠️ Customization

### Changing the Target Service

To monitor a different Cloud Run service:

```bash
export GCP_CLOUD_RUN_SERVICE_NAME="your-new-service-name"
npm run deploy
```

### Modifying the UI

The frontend is built with React and Tailwind CSS. Key files:

- `frontend/App.jsx`: Main application component
- `frontend/index.css`: Styling with Tailwind
- `backend/index.js`: Backend API and WebSocket server

### Adding Authentication

For production use, consider adding authentication:

1. **Google OAuth**: Use Google Cloud Identity
2. **API Keys**: Implement API key authentication
3. **Custom Auth**: Add your own authentication system

## 📚 Learning Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Google Cloud Logging API](https://cloud.google.com/logging/docs)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google Cloud Platform for the excellent logging APIs
- The React and Tailwind CSS communities
- All contributors who helped improve this project

---

**Made with ❤️ for the Google Cloud community**
