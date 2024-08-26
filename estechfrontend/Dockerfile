# estechfrontend/Dockerfile

# Dockerfile for Vite React TS Frontend
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

ENV VITE_API_BASE_URL=https://estechpc.ru/api/

# Build the project
RUN npm run build

# Serve the application using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
