from datetime import datetime, timezone

from app.core.exceptions import (
    CapacityExceededError,
    DuplicateRegistrationError,
    EventNotFoundError,
    PastEventError,
    RegistrationNotFoundError,
)
from app.models.registration import Registration
from app.repositories.event_repository import EventRepository
from app.repositories.registration_repository import RegistrationRepository


class RegistrationService:
    """
    Handles all business logic for event registrations.

    Business rules enforced here:
      1. Cannot register for past events.
      2. Cannot exceed event capacity.
      3. Cannot double-register (same user_email + event_id).
    """

    def __init__(
        self,
        event_repo: EventRepository,
        registration_repo: RegistrationRepository,
    ):
        self._event_repo = event_repo
        self._registration_repo = registration_repo

    def register(self, event_id: int, user_email: str) -> dict:
        """
        Register a user for an event.

        Validates:
          - Event exists
          - Event is in the future (Rule 1)
          - Event has remaining capacity (Rule 2)
          - User is not already registered (Rule 3)
        """
        event = self._event_repo.get_by_id(event_id)
        if event is None:
            raise EventNotFoundError(event_id)

        # Rule 1: Cannot register for past events
        if event.date <= datetime.now(timezone.utc):
            raise PastEventError(event_id)

        # Rule 2: Cannot exceed capacity
        current_count = self._registration_repo.count_by_event(event_id)
        if current_count >= event.max_capacity:
            raise CapacityExceededError(event_id)

        # Rule 3: Cannot double-register
        existing = self._registration_repo.get_by_email_and_event(user_email, event_id)
        if existing is not None:
            raise DuplicateRegistrationError(event_id, user_email)

        registration = self._registration_repo.create(
            event_id=event_id,
            user_email=user_email,
        )
        return self._serialize(registration)

    def unregister(self, event_id: int, user_email: str) -> None:
        """
        Unregister a user from an event.
        Raises EventNotFoundError if event doesn't exist.
        Raises RegistrationNotFoundError if the user was not registered.
        """
        event = self._event_repo.get_by_id(event_id)
        if event is None:
            raise EventNotFoundError(event_id)

        deleted = self._registration_repo.delete(
            user_email=user_email, event_id=event_id
        )
        if not deleted:
            raise RegistrationNotFoundError(event_id, user_email)

    def list_registrations(self, event_id: int) -> list[dict]:
        """
        List all registrations for a given event.
        Raises EventNotFoundError if event doesn't exist.
        """
        event = self._event_repo.get_by_id(event_id)
        if event is None:
            raise EventNotFoundError(event_id)

        registrations = self._registration_repo.get_by_event(event_id)
        return [self._serialize(r) for r in registrations]

    def _serialize(self, registration: Registration) -> dict:
        """Convert a Registration model to a serializable dict."""
        return {
            "id": registration.id,
            "event_id": registration.event_id,
            "user_email": registration.user_email,
            "registered_at": registration.registered_at,
        }
