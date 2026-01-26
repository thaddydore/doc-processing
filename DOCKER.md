# Docker Setup Guide

This document explains how to run the Data Processing Application using Docker.

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)

## Quick Start

### Build and run all services:

```bash
docker-compose up --build
```

This will:

- Build the backend FastAPI service
- Build the frontend React application
- Start both services with proper networking
- Make the application available at:
  - Frontend: http://localhost
  - Backend API: http://localhost:8000
  - API Docs: http://localhost:8000/docs

### Run in detached mode:

```bash
docker-compose up -d
```

### Stop all services:

```bash
docker-compose down
```

### View logs:

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

## Development vs Production

### Development Mode

The current `docker-compose.yml` is configured for development with:

- Source code volume mounting for hot-reload (backend only)
- Health checks enabled
- Debug-friendly settings

### Production Mode

For production deployment:

1. **Remove volume mounting** in `docker-compose.yml`:

   ```yaml
   # Comment out or remove this line:
   # - ./backend/app:/app/app
   ```

2. **Update API URL** in frontend environment:

   ```yaml
   environment:
     - VITE_API_URL=https://your-production-api.com
   ```

3. **Add environment variables** for secrets (create `.env` file):
   ```env
   BACKEND_SECRET_KEY=your-secret-key
   DATABASE_URL=your-database-url
   ```

## Individual Service Commands

### Backend Only

```bash
# Build
docker build -t doc-processing-backend ./backend

# Run
docker run -p 8000:8000 doc-processing-backend
```

### Frontend Only

```bash
# Build
docker build -t doc-processing-frontend ./frontend

# Run
docker run -p 80:80 doc-processing-frontend
```

## Architecture

```
┌─────────────────────┐
│   Frontend (80)     │
│   React + Nginx     │
└──────────┬──────────┘
           │
           │ HTTP
           │
┌──────────▼──────────┐
│   Backend (8000)    │
│   FastAPI + Python  │
└─────────────────────┘
```

## File Structure

```
doc-processing/
├── docker-compose.yml          # Orchestrates both services
├── backend/
│   ├── Dockerfile              # Backend container definition
│   ├── .dockerignore           # Files to exclude from build
│   └── app/                    # Application code
├── frontend/
│   ├── Dockerfile              # Multi-stage build for frontend
│   ├── nginx.conf              # Nginx server configuration
│   ├── .dockerignore           # Files to exclude from build
│   └── src/                    # Application code
└── DOCKER.md                   # This file
```

## Troubleshooting

### Port already in use

If ports 80 or 8000 are already in use, modify `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8001:8000" # Use port 8001 instead of 8000

  frontend:
    ports:
      - "3000:80" # Use port 3000 instead of 80
```

### Backend not accessible from frontend

Ensure both services are on the same network (already configured in docker-compose.yml).

### Build fails

Try cleaning Docker cache:

```bash
docker-compose down --volumes --remove-orphans
docker system prune -a
docker-compose up --build
```

### Check service health

```bash
# View health status
docker-compose ps

# Inspect specific service
docker inspect doc-processing-backend
docker inspect doc-processing-frontend
```

## Advanced Usage

### Rebuild specific service

```bash
docker-compose up --build backend
docker-compose up --build frontend
```

### Execute commands in running container

```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

### View resource usage

```bash
docker stats
```

## Notes

- The frontend is built using a multi-stage Docker build for optimal image size
- Nginx serves the static files in production with proper caching headers
- Health checks ensure services are running correctly
- Backend uses Python 3.11 slim image for smaller footprint
- Development volume mounting allows code changes without rebuilding
