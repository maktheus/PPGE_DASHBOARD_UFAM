# Use Node.js LTS version as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 5173

# Build the application
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]