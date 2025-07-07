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

# Build the frontend
RUN npm run frontend:build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port used by Cloud Run
EXPOSE 8080

# Start the application
CMD ["npm", "start"] 