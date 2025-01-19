# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Copy the entire project into the container
COPY . .

# Expose the application port (Cloud Run automatically assigns a port)
ENV PORT=8080
EXPOSE 8080

# Set environment variables (Cloud Run injects environment variables from Secrets Manager)
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
