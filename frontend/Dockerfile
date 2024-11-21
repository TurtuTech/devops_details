# Use an official Node.js image as the base for building
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Use an Nginx image to serve the static files
FROM nginx:alpine

# Copy the build files to Nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 3000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
