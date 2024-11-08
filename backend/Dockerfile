# Use the official Node.js image as a base
FROM node:14

# Create and set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code into the container
COPY . .

# Expose the port your app runs on (adjust if necessary)
EXPOSE 5000

# Define the command to run your app
CMD ["npm", "start"]