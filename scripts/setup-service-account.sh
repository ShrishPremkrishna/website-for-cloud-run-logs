#!/bin/bash

# Exit on any error
set -e

echo "🔧 Setting up Google Cloud Service Account for Cloud Run Log Viewer"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ You are not authenticated with Google Cloud. Please run:"
    echo "   gcloud auth login"
    exit 1
fi

# Get project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID

# Set the project
gcloud config set project $PROJECT_ID

echo ""
echo "📋 Creating service account..."

# Create service account
SERVICE_ACCOUNT_NAME="cloud-run-log-viewer"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Check if service account already exists
if gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL &>/dev/null; then
    echo "✅ Service account already exists"
else
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --display-name="Cloud Run Log Viewer" \
        --description="Service account for Cloud Run Log Viewer application"
    echo "✅ Service account created"
fi

echo ""
echo "🔑 Assigning permissions..."

# Assign Logging Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/logging.admin"

# Assign Cloud Run Viewer role (to read service information)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/run.viewer"

echo "✅ Permissions assigned"

echo ""
echo "📄 Creating service account key..."

# Create and download the key
gcloud iam service-accounts keys create service-account.json \
    --iam-account=$SERVICE_ACCOUNT_EMAIL

echo "✅ Service account key created: service-account.json"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy service-account.json to your project root"
echo "2. Set your environment variables:"
echo "   export GCP_PROJECT_ID=$PROJECT_ID"
echo "   export GCP_CLOUD_RUN_SERVICE_NAME=your-service-name"
echo "3. Run: ./deploy.sh"
echo ""
echo "⚠️  Important: Keep service-account.json secure and never commit it to version control!" 