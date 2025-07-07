# 🚀 Deployment Guide

This guide covers multiple deployment options for your Cloud Run Log Viewer.

## Option 1: Google Cloud Run (Recommended)

### Prerequisites
- Google Cloud CLI installed and configured
- Docker installed
- Google Cloud project with billing enabled

### Quick Deploy
```bash
# Set your project ID
export GCP_PROJECT_ID="your-project-id"
export GCP_CLOUD_RUN_SERVICE_NAME="your-service-name"

# Deploy
npm run deploy
```

### Manual Deploy
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

## Option 2: Railway

### Prerequisites
- Railway account
- GitHub repository

### Steps
1. **Connect Repository**: Link your GitHub repo to Railway
2. **Set Environment Variables**:
   - `GCP_PROJECT_ID`: Your Google Cloud project ID
   - `GCP_CLOUD_RUN_SERVICE_NAME`: Your Cloud Run service name
   - `GCP_KEY_PATH`: `/app/service-account.json`
3. **Add Service Account**: Upload `service-account.json` as a secret
4. **Deploy**: Railway will automatically build and deploy

## Option 3: Render

### Prerequisites
- Render account
- GitHub repository

### Steps
1. **Create Web Service**: Connect your GitHub repo
2. **Configure Build**:
   - Build Command: `npm run frontend:build`
   - Start Command: `npm start`
3. **Set Environment Variables**:
   - `GCP_PROJECT_ID`
   - `GCP_CLOUD_RUN_SERVICE_NAME`
   - `GCP_KEY_PATH=/app/service-account.json`
4. **Add Service Account**: Upload `service-account.json` as a secret file
5. **Deploy**: Render will build and deploy automatically

## Option 4: Heroku

### Prerequisites
- Heroku account
- Heroku CLI

### Steps
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set GCP_PROJECT_ID=your-project-id
heroku config:set GCP_CLOUD_RUN_SERVICE_NAME=your-service-name
heroku config:set GCP_KEY_PATH=/app/service-account.json

# Add service account
heroku config:set GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json

# Deploy
git push heroku main
```

## Option 5: Vercel (Frontend Only)

### Prerequisites
- Vercel account
- Separate backend deployment

### Steps
1. **Deploy Backend**: Deploy the backend to any platform (Railway, Render, etc.)
2. **Configure Frontend**: Update WebSocket URL in `frontend/App.jsx`
3. **Deploy Frontend**: Connect your GitHub repo to Vercel
4. **Set Environment**: Configure the backend URL

## Option 6: Local Development with ngrok

### Prerequisites
- Node.js installed
- ngrok installed

### Steps
```bash
# Install ngrok
npm install -g ngrok

# Start your application
npm run dev

# Expose with ngrok
ngrok http 3000
```

### Benefits
- ✅ Instant deployment
- ✅ No Google Cloud setup required
- ✅ Built-in authentication options
- ✅ Traffic inspection and replay
- ✅ Works behind firewalls/NAT

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GCP_PROJECT_ID` | Your Google Cloud project ID | Yes | `my-project-123` |
| `GCP_CLOUD_RUN_SERVICE_NAME` | Name of the Cloud Run service to monitor | Yes | `my-api-service` |
| `GCP_KEY_PATH` | Path to service account key file | Yes | `/app/service-account.json` |
| `PORT` | Port for local development | No | `3000` |

## Service Account Setup

For all deployment options, you need a Google Cloud service account:

```bash
# Run the setup script
npm run setup

# This will create:
# - Service account with proper permissions
# - service-account.json file
# - Required IAM bindings
```

## Troubleshooting

### Common Issues

1. **"Permission denied"**
   ```bash
   # Check authentication
   gcloud auth list
   
   # Re-authenticate if needed
   gcloud auth login
   ```

2. **"Service account not found"**
   ```bash
   # Run setup again
   npm run setup
   ```

3. **"No logs appearing"**
   - Verify service name is correct
   - Check service account permissions
   - Ensure target service is running

4. **"Connection lost"**
   - Normal behavior, app will auto-reconnect
   - Check internet connection
   - Verify backend is running

### Checking Deployment Status

```bash
# Google Cloud Run
gcloud run services describe cloud-run-log-viewer

# Check logs
gcloud run logs read --service=cloud-run-log-viewer

# Health check
curl https://your-app-url/health
```

## Cost Considerations

### Google Cloud Run
- **Min 1 instance**: ~$17-20/month
- **Max 10 instances**: Prevents runaway costs
- **CPU allocation**: Optimized for performance

### Other Platforms
- **Railway**: Pay-per-use, starts at $5/month
- **Render**: Free tier available, then $7/month
- **Heroku**: Free tier discontinued, starts at $7/month
- **Vercel**: Generous free tier

## Security Best Practices

1. **Service Account**: Use minimal required permissions
2. **HTTPS**: All platforms provide HTTPS by default
3. **Authentication**: Consider adding auth for production
4. **Key Management**: Never commit service account keys
5. **Environment Variables**: Use platform secrets management

## Next Steps

1. **For immediate demos**: Use ngrok
2. **For ongoing access**: Use Cloud Run or Railway
3. **For production**: Add authentication and monitoring
4. **For learning**: Try multiple deployment options 