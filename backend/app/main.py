import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import process

app = FastAPI(
    title="Data Processing API",
    description="API for processing Excel and CSV files with dynamic filtering",
    version="1.0.0"
)

# Configure CORS for frontend access
cors_origins_str = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:80,http://localhost,http://127.0.0.1:5173,http://127.0.0.1:80,http://127.0.0.1"
)
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(process.router, tags=["Processing"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Data Processing API",
        "status": "running",
        "docs": "/docs"
    }
