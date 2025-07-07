# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy application code
COPY . .

# Copy service account file if it exists
COPY service-account.json* ./

# Build the frontend
RUN npm run frontend:build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 