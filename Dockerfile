# syntax=docker/dockerfile:1
FROM node:16.14.0

# Update Container
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Set ENV Variables
ENV NODE_ENV=production

# Expose default Port 80
EXPOSE 80

# Install packages
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

# Copy App
COPY . .

# Create Volumes for DB and uploaded Images
VOLUME [ "/app/database" ]
VOLUME [ "/app/public/images/upload" ]

# Command to be excecuted then the container start
CMD [ "node", "bin/www" ]