# Deployment Guide

This guide covers two deployment options for demoing your cloud-run-log-viewer to your team.

## Option 1: Quick Demo with ngrok (Recommended for immediate demos)

### Prerequisites
- Node.js installed
- Your app running locally

### Steps
1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start your application:**
   ```bash
   npm run dev
   ```

3. **Expose with ngrok:**
   ```bash
   ngrok http 3000
   ```

4. **Share the ngrok URL** with your team (e.g., `https://abc123.ngrok.io`)

### Benefits
- ✅ Instant deployment
- ✅ No Google Cloud setup required
- ✅ Built-in authentication options
- ✅ Traffic inspection and replay
- ✅ Works behind firewalls/NAT

## Option 2: Production-Ready Deployment with Cloud Run

### Prerequisites
- Google Cloud CLI installed and configured
- Docker installed
- Google Cloud project with billing enabled

### Steps

1. **Set your project ID:**
   ```bash
   export GCP_PROJECT_ID="your-actual-project-id"
   ```

2. **Enable required APIs:**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Deploy using the script:**
   ```bash
   ./deploy.sh
   ```

4. **Share the Cloud Run URL** with your team

### Benefits
- ✅ Permanent deployment
- ✅ Scalable infrastructure
- ✅ Professional presentation
- ✅ Can be used for production
- ✅ No local machine dependency

## Environment Variables

Make sure these are set in your Cloud Run deployment:
- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `GCP_CLOUD_RUN_SERVICE_NAME`: The name of your Cloud Run service (default: "hi")
- `GCP_KEY_PATH`: Path to your service account key file

## Security Considerations

1. **Service Account**: Ensure your service account has minimal required permissions
2. **Authentication**: Consider adding authentication for production use
3. **HTTPS**: Both ngrok and Cloud Run provide HTTPS by default

## Troubleshooting

### ngrok Issues
- If you get "tunnel not found", restart ngrok
- Use `ngrok http 3000 --host-header=localhost:3000` if needed

### Cloud Run Issues
- Check logs: `gcloud run logs read --service=cloud-run-log-viewer`
- Verify environment variables are set correctly
- Ensure service account has proper permissions

## Next Steps

1. **For immediate demos**: Use ngrok
2. **For ongoing access**: Use Cloud Run
3. **For enhanced presentations**: Consider integrating with [Demo Gorilla](https://demogorilla.com/docs/first-demo) for talking points and presenter notes
4. **For production**: Add authentication, monitoring, and proper CI/CD 