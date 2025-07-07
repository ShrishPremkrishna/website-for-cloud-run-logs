#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

# Check if required environment variables are set
if [ -z "$GCP_PROJECT_ID" ]; then
    print_error "❌ GCP_PROJECT_ID environment variable is not set"
    echo "Please set it with: export GCP_PROJECT_ID=your-project-id"
    exit 1
fi

if [ -z "$GCP_CLOUD_RUN_SERVICE_NAME" ]; then
    print_warning "⚠️  GCP_CLOUD_RUN_SERVICE_NAME not set, using default: 'hi'"
    export GCP_CLOUD_RUN_SERVICE_NAME="hi"
fi

# Configuration
PROJECT_ID=$GCP_PROJECT_ID
SERVICE_NAME="cloud-run-log-viewer"
REGION="us-central1"

# Check if service account file exists
if [ ! -f "service-account.json" ]; then
    print_error "❌ service-account.json not found in project root"
    echo "Please run: ./scripts/setup-service-account.sh"
    exit 1
fi

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "❌ Google Cloud CLI is not installed"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_error "❌ You are not authenticated with Google Cloud"
    echo "Please run: gcloud auth login"
    exit 1
fi

print_status "🚀 Deploying Cloud Run Log Viewer to Google Cloud..."

# Enable required APIs
print_status "📋 Enabling required APIs..."
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID

# Create and use buildx builder if not already present
if ! docker buildx inspect cloudrunbuilder &>/dev/null; then
    print_status "🔧 Setting up Docker buildx builder..."
    docker buildx create --use --name cloudrunbuilder
else
    docker buildx use cloudrunbuilder
fi

# Build and push the Docker image
print_status "📦 Building and pushing Docker image..."
docker buildx build --platform linux/amd64 -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest --push .

# Deploy to Cloud Run
print_status "🌐 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="GCP_PROJECT_ID=$PROJECT_ID,GCP_CLOUD_RUN_SERVICE_NAME=$GCP_CLOUD_RUN_SERVICE_NAME,GCP_KEY_PATH=/app/service-account.json" \
    --memory 512Mi \
    --cpu 1 \
    --cpu-boost \
    --min-instances 1 \
    --max-instances 10

print_status "✅ Deployment complete!"
print_status "🌍 Your app is available at: https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app"
echo ""
print_warning "💡 To view logs from a different Cloud Run service, update GCP_CLOUD_RUN_SERVICE_NAME and redeploy" 