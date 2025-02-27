# Use Node.js to build the Vue app
FROM node:20 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build
COPY . ./
RUN npm run build

# Use Nginx to serve the built static files
FROM nginx:alpine AS runtime

# Copy the built app from the build stage to the Nginx container
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file from your project
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
