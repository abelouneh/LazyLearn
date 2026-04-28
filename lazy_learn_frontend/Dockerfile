# Start with a Node environment to build the React app
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package lists and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code and build it
COPY . .
RUN npm run build

# Start a lightweight web server to serve the React app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]