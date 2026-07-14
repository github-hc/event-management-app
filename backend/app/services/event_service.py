from datetime import datetime, timezone

from app.core.exceptions import EventNotFoundError, InvalidEventDateError
from app.models.event import Event
from app.repositories.event_repository import EventRepository
from app.repositories.registration_repository import RegistrationRepository


class EventService:
    """
    Handles all business logic for event management.
    Orchestrates EventRepository and RegistrationRepository.
    """

    def __init__(
        self,
        event_repo: EventRepository,
        registration_repo: RegistrationRepository,
    ):
        self._event_repo = event_repo
        self._registration_repo = registration_repo

    def list_events(self) -> list[dict]:
        """Return all events enriched with their current registration count."""
        events = self._event_repo.get_all()
        return [self._enrich(event) for event in events]

    def get_event(self, event_id: int) -> dict:
        """Return a single event by ID. Raises EventNotFoundError if not found."""
        event = self._event_repo.get_by_id(event_id)
        if event is None:
            raise EventNotFoundError(event_id)
        return self._enrich(event)

    def create_event(
        self,
        title: str,
        description: str,
        date: datetime,
        max_capacity: int,
    ) -> dict:
        """
        Create a new event after validating that the date is in the future.
        Raises InvalidEventDateError if date is in the past.
        """
        if date <= datetime.now(timezone.utc):
            raise InvalidEventDateError()

        event = self._event_repo.create(
            title=title,
            description=description,
            date=date,
            max_capacity=max_capacity,
        )
        return self._enrich(event)

    def update_event(
        self,
        event_id: int,
        title: str | None = None,
        description: str | None = None,
        date: datetime | None = None,
        max_capacity: int | None = None,
    ) -> dict:
        """
        Partially update an event.
        - Validates event exists (EventNotFoundError)
        - Validates new date is not in the past (InvalidEventDateError)
        """
        existing = self._event_repo.get_by_id(event_id)
        if existing is None:
            raise EventNotFoundError(event_id)

        if date is not None and date <= datetime.now(timezone.utc):
            raise InvalidEventDateError()

        event = self._event_repo.update(
            event_id=event_id,
            title=title,
            description=description,
            date=date,
            max_capacity=max_capacity,
        )
        return self._enrich(event)  # type: ignore[arg-type]

    def delete_event(self, event_id: int) -> None:
        """
        Delete an event and cascade-delete all its registrations.
        Raises EventNotFoundError if the event does not exist.
        """
        if not self._event_repo.get_by_id(event_id):
            raise EventNotFoundError(event_id)

        # Cascade: remove all registrations for this event first
        self._registration_repo.delete_by_event(event_id)
        self._event_repo.delete(event_id)

    def _enrich(self, event: Event) -> dict:
        """Attach runtime-computed fields (registered_count) to an event dict."""
        registered_count = self._registration_repo.count_by_event(event.id)
        return {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "max_capacity": event.max_capacity,
            "registered_count": registered_count,
            "available_spots": max(0, event.max_capacity - registered_count),
            "created_at": event.created_at,
            "updated_at": event.updated_at,
        }
