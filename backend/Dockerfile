# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (for faster rebuilds)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set production environment defaults
ENV NODE_ENV=production
ENV PORT=8080

# Expose the Cloud Run default port
EXPOSE 8080

# Run the app
CMD ["node", "dist/main"]
