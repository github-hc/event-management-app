from datetime import datetime, timezone

from app.models.event import Event
from app.repositories.memory_db import db


class EventRepository:
    """Handles all data access operations for Events against the in-memory store."""

    def get_all(self) -> list[Event]:
        """Return all events sorted by date ascending."""
        return sorted(db.events.values(), key=lambda e: e.date)

    def get_by_id(self, event_id: int) -> Event | None:
        """Return an event by its ID, or None if not found."""
        return db.events.get(event_id)

    def create(
        self,
        title: str,
        description: str,
        date: datetime,
        max_capacity: int,
    ) -> Event:
        """Persist a new event and return it with its assigned ID."""
        event_id = db.event_counter
        db.event_counter += 1

        event = Event(
            id=event_id,
            title=title,
            description=description,
            date=date,
            max_capacity=max_capacity,
        )
        db.events[event_id] = event
        return event

    def update(
        self,
        event_id: int,
        title: str | None = None,
        description: str | None = None,
        date: datetime | None = None,
        max_capacity: int | None = None,
    ) -> Event | None:
        """Apply partial updates to an event. Returns None if event not found."""
        event = db.events.get(event_id)
        if event is None:
            return None

        if title is not None:
            event.title = title
        if description is not None:
            event.description = description
        if date is not None:
            event.date = date
        if max_capacity is not None:
            event.max_capacity = max_capacity

        event.updated_at = datetime.now(timezone.utc)
        return event

    def delete(self, event_id: int) -> bool:
        """Delete an event by ID. Returns True if deleted, False if not found."""
        if event_id not in db.events:
            return False
        del db.events[event_id]
        return True
