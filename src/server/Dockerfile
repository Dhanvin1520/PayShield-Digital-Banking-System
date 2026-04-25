# Stage 1: Build the TypeScript application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port (Render uses PORT env var)
EXPOSE 5001

# Start the server
CMD ["node", "dist/server.js"]
