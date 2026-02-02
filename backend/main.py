from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import energy

app = FastAPI(title="Energy Truck Backend", version="1.0.0")

# CORS middleware setup to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify backend status.
    """
    return {"status": "ok", "message": "Energy Truck Backend is running"}

@app.get("/")
async def root():
    return {"message": "Welcome to Energy Truck API"}

app.include_router(energy.router)
