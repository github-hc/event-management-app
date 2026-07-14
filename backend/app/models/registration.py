from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Registration:
    """Represents a user registration for an event."""

    id: int
    event_id: int
    user_email: str
    registered_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))