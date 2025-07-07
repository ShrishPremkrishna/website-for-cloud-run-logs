#!/bin/bash

# Exit on any error
set -e

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"striking-lane-458100-j4"}
SERVICE_NAME="cloud-run-log-viewer"
REGION="us-central1"

# Create and use buildx builder if not already present
if ! docker buildx inspect cloudrunbuilder &>/dev/null; then
  docker buildx create --use --name cloudrunbuilder
else
  docker buildx use cloudrunbuilder
fi

echo "🚀 Deploying to Google Cloud Run..."

# Build and push the Docker image for linux/amd64

echo "📦 Building and pushing Docker image for linux/amd64..."
docker buildx build --platform linux/amd64 -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest --push .

# Deploy to Cloud Run
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="GCP_PROJECT_ID=$PROJECT_ID,GCP_CLOUD_RUN_SERVICE_NAME=hi,GCP_KEY_PATH=/app/service-account.json" \
  --memory 512Mi \
  --cpu 1 \
  --cpu-boost \
  --min-instances 1 \
  --max-instances 10

echo "✅ Deployment complete!"
echo "🌍 Your app is available at: https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app" 