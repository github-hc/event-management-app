from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Event:
    """Represents an event in the system."""

    id: int
    title: str
    description: str
    date: datetime
    max_capacity: int
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))