from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegistrationRequest(BaseModel):
    """Request body schema for registering a user for an event."""

    user_email: EmailStr = Field(..., description="Email address of the user to register")


class RegistrationResponse(BaseModel):
    """Response schema for a registration record."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int
    user_email: str
    registered_at: datetime
