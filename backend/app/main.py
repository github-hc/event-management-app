from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.events import router as event_router
from app.api.registrations import router as registration_router
from app.core.exception_handlers import register_exception_handlers

app = FastAPI(
    title="Event Management API",
    version="1.0.0",
    description=(
        "A REST API for managing events and attendee registrations. "
        "Supports creating, updating, and deleting events, "
        "and registering or unregistering users with full business rule enforcement."
    ),
    contact={"name": "Event Management Team"},
)

# CORS — allow all origins for local development / frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all custom domain exception handlers
register_exception_handlers(app)

# Mount routers
app.include_router(event_router, prefix="/events", tags=["Events"])
app.include_router(registration_router, tags=["Registrations"])


@app.get("/", tags=["Health"])
def health():
    """Health check endpoint."""
    return {"status": "running", "version": "1.0.0"}