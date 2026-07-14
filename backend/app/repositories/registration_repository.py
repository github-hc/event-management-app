from app.models.registration import Registration
from app.repositories.memory_db import db


class RegistrationRepository:
    """Handles all data access operations for Registrations against the in-memory store."""

    def get_by_event(self, event_id: int) -> list[Registration]:
        """Return all registrations for a given event."""
        return [r for r in db.registrations if r.event_id == event_id]

    def get_by_email_and_event(self, user_email: str, event_id: int) -> Registration | None:
        """Return a specific registration record, or None if not found."""
        for registration in db.registrations:
            if registration.event_id == event_id and registration.user_email == user_email:
                return registration
        return None

    def count_by_event(self, event_id: int) -> int:
        """Return the total number of registrations for an event."""
        return sum(1 for r in db.registrations if r.event_id == event_id)

    def create(self, event_id: int, user_email: str) -> Registration:
        """Create a new registration and persist it."""
        registration_id = db.registration_counter
        db.registration_counter += 1

        registration = Registration(
            id=registration_id,
            event_id=event_id,
            user_email=user_email,
        )
        db.registrations.append(registration)
        return registration

    def delete(self, user_email: str, event_id: int) -> bool:
        """Remove a registration. Returns True if deleted, False if not found."""
        for i, registration in enumerate(db.registrations):
            if registration.event_id == event_id and registration.user_email == user_email:
                db.registrations.pop(i)
                return True
        return False

    def delete_by_event(self, event_id: int) -> int:
        """Remove all registrations for an event (cascade delete). Returns count deleted."""
        original_count = len(db.registrations)
        db.registrations = [r for r in db.registrations if r.event_id != event_id]
        return original_count - len(db.registrations)
