
# Use Nginx to serve the already built React app
FROM nginx:alpine

# Copy the already built app from the build context to Nginx's HTML folder
COPY ./build_project /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Run Nginx in the foreground to serve the app
CMD ["nginx", "-g", "daemon off;"]
