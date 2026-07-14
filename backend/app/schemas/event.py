from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class EventCreate(BaseModel):
    """Request body schema for creating a new event."""

    title: str = Field(..., min_length=1, max_length=200, description="Event title")
    description: str = Field(..., min_length=1, description="Detailed description")
    date: datetime = Field(..., description="Event date and time (must be in the future)")
    max_capacity: int = Field(..., ge=1, description="Maximum number of attendees")

    @field_validator("title", "description", mode="before")
    @classmethod
    def strip_whitespace(cls, value: str) -> str:
        return value.strip()


class EventUpdate(BaseModel):
    """Request body schema for updating an event. All fields are optional (PATCH semantics)."""

    title: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = Field(None, min_length=1)
    date: datetime | None = Field(None)
    max_capacity: int | None = Field(None, ge=1)

    @field_validator("title", "description", mode="before")
    @classmethod
    def strip_whitespace(cls, value: str | None) -> str | None:
        if value is not None:
            return value.strip()
        return value


class EventResponse(BaseModel):
    """Response schema for a single event, including computed availability fields."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    date: datetime
    max_capacity: int
    registered_count: int
    available_spots: int
    created_at: datetime
    updated_at: datetime
