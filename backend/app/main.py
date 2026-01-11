from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import process

app = FastAPI(
    title="Data Processing API",
    description="API for processing Excel and CSV files with dynamic filtering",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
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
