# Multi-stage Dockerfile for Flask backend + React frontend
# Builds React app, installs Python dependencies, then serves both via nginx + gunicorn

# 1) Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
ENV REACT_APP_API_URL=/api
RUN npm run build

# 2) Final runtime image
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install nginx for serving the built frontend and proxying API requests
RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt gunicorn

# Copy backend code and built frontend assets
COPY backend /app/backend
COPY --from=frontend-build /app/frontend/build /app/frontend_build
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure instance directory exists for SQLite database
RUN mkdir -p /app/backend/instance

WORKDIR /app/backend

# Add startup script that seeds DB and runs services
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/bin/sh","/app/start.sh"]
