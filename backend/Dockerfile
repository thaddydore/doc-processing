# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy environment file and install dependencies
COPY environment.yml .

# Install dependencies using pip (since we're not using conda in Docker)
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn[standard] \
    pandas \
    openpyxl \
    python-multipart

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
