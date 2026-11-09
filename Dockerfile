
# Use a supported Node.js LTS image.
FROM node:24-bookworm-slim

# Set the application working directory.
WORKDIR /app

# Install production dependencies.
COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

# Copy application source code.
COPY src ./src

# Create the data directory and assign ownership.
RUN mkdir -p /app/data \
    && chown -R node:node /app

# Run the application without root privileges.
USER node

# The Express API listens on port 3000.
EXPOSE 3000

# Start the production API.
CMD ["npm", "start"]
