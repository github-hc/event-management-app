"""
Unit tests for RegistrationService.
Covers all 3 business rules and happy-path registration/unregistration flows.
"""
import pytest

from app.core.exceptions import (
    CapacityExceededError,
    DuplicateRegistrationError,
    EventNotFoundError,
    PastEventError,
    RegistrationNotFoundError,
)


class TestRegister:
    # ------------------------------------------------------------------ #
    # Happy path
    # ------------------------------------------------------------------ #
    def test_register_success(self, registration_service, sample_event):
        result = registration_service.register(sample_event["id"], "alice@example.com")
        assert result["event_id"] == sample_event["id"]
        assert result["user_email"] == "alice@example.com"
        assert result["id"] is not None

    def test_register_multiple_different_users(self, registration_service, sample_event):
        registration_service.register(sample_event["id"], "alice@example.com")
        registration_service.register(sample_event["id"], "bob@example.com")
        registrations = registration_service.list_registrations(sample_event["id"])
        assert len(registrations) == 2

    def test_register_same_user_different_events(
        self, event_service, registration_service, future_date
    ):
        from datetime import timedelta
        event1 = event_service.create_event("Event 1", "Desc", future_date, 5)
        event2 = event_service.create_event("Event 2", "Desc", future_date + timedelta(days=1), 5)
        registration_service.register(event1["id"], "alice@example.com")
        registration_service.register(event2["id"], "alice@example.com")
        assert len(registration_service.list_registrations(event1["id"])) == 1
        assert len(registration_service.list_registrations(event2["id"])) == 1

    # ------------------------------------------------------------------ #
    # Business Rule 1: Cannot register for past events
    # ------------------------------------------------------------------ #
    def test_register_for_past_event_raises(
        self, event_repo, registration_service, past_date
    ):
        """
        Bypass service validation to manually insert a past event,
        then verify the registration service correctly rejects it.
        """
        past_event = event_repo.create(
            title="Past Concert",
            description="Already happened",
            date=past_date,
            max_capacity=100,
        )
        with pytest.raises(PastEventError) as exc_info:
            registration_service.register(past_event.id, "user@example.com")
        assert exc_info.value.error_code == "PAST_EVENT"

    # ------------------------------------------------------------------ #
    # Business Rule 2: Cannot exceed event capacity
    # ------------------------------------------------------------------ #
    def test_register_at_full_capacity_raises(self, registration_service, sample_event):
        """
        sample_event has max_capacity=2.
        After 2 successful registrations, the 3rd should raise CapacityExceededError.
        """
        registration_service.register(sample_event["id"], "user1@example.com")
        registration_service.register(sample_event["id"], "user2@example.com")

        with pytest.raises(CapacityExceededError) as exc_info:
            registration_service.register(sample_event["id"], "user3@example.com")
        assert exc_info.value.error_code == "CAPACITY_EXCEEDED"

    def test_register_exactly_at_capacity_succeeds(self, registration_service, sample_event):
        """The last available spot (capacity - 1 → capacity) should succeed."""
        registration_service.register(sample_event["id"], "user1@example.com")
        result = registration_service.register(sample_event["id"], "user2@example.com")
        assert result["user_email"] == "user2@example.com"

    # ------------------------------------------------------------------ #
    # Business Rule 3: Cannot double-register
    # ------------------------------------------------------------------ #
    def test_double_register_same_user_raises(self, registration_service, sample_event):
        registration_service.register(sample_event["id"], "alice@example.com")

        with pytest.raises(DuplicateRegistrationError) as exc_info:
            registration_service.register(sample_event["id"], "alice@example.com")
        assert exc_info.value.error_code == "DUPLICATE_REGISTRATION"

    # ------------------------------------------------------------------ #
    # Event not found
    # ------------------------------------------------------------------ #
    def test_register_for_nonexistent_event_raises(self, registration_service):
        with pytest.raises(EventNotFoundError):
            registration_service.register(999, "user@example.com")


class TestUnregister:
    def test_unregister_success(self, registration_service, sample_event):
        registration_service.register(sample_event["id"], "alice@example.com")
        registration_service.unregister(sample_event["id"], "alice@example.com")
        registrations = registration_service.list_registrations(sample_event["id"])
        assert len(registrations) == 0

    def test_unregister_not_registered_raises(self, registration_service, sample_event):
        with pytest.raises(RegistrationNotFoundError) as exc_info:
            registration_service.unregister(sample_event["id"], "ghost@example.com")
        assert exc_info.value.error_code == "REGISTRATION_NOT_FOUND"

    def test_unregister_from_nonexistent_event_raises(self, registration_service):
        with pytest.raises(EventNotFoundError):
            registration_service.unregister(999, "user@example.com")

    def test_unregister_allows_reregistration(self, registration_service, sample_event):
        """After unregistering, the same user should be able to register again."""
        registration_service.register(sample_event["id"], "alice@example.com")
        registration_service.unregister(sample_event["id"], "alice@example.com")
        result = registration_service.register(sample_event["id"], "alice@example.com")
        assert result["user_email"] == "alice@example.com"


class TestListRegistrations:
    def test_list_registrations_empty(self, registration_service, sample_event):
        result = registration_service.list_registrations(sample_event["id"])
        assert result == []

    def test_list_registrations_returns_all(self, registration_service, sample_event):
        registration_service.register(sample_event["id"], "a@example.com")
        registration_service.register(sample_event["id"], "b@example.com")
        result = registration_service.list_registrations(sample_event["id"])
        emails = {r["user_email"] for r in result}
        assert emails == {"a@example.com", "b@example.com"}

    def test_list_registrations_nonexistent_event_raises(self, registration_service):
        with pytest.raises(EventNotFoundError):
            registration_service.list_registrations(999)
