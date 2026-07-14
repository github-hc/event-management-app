"""
Unit tests for EventService.
Tests cover: create, get, list, update, delete events — including validation rules.
"""
import pytest
from datetime import datetime, timedelta, timezone

from app.core.exceptions import EventNotFoundError, InvalidEventDateError
from app.services.event_service import EventService


class TestCreateEvent:
    def test_create_event_success(self, event_service, future_date):
        event = event_service.create_event(
            title="PyCon 2027",
            description="Annual Python conference",
            date=future_date,
            max_capacity=100,
        )
        assert event["id"] == 1
        assert event["title"] == "PyCon 2027"
        assert event["max_capacity"] == 100
        assert event["registered_count"] == 0
        assert event["available_spots"] == 100

    def test_create_event_increments_id(self, event_service, future_date):
        event1 = event_service.create_event("Event 1", "Desc", future_date, 10)
        event2 = event_service.create_event("Event 2", "Desc", future_date, 10)
        assert event2["id"] == event1["id"] + 1

    def test_create_event_with_past_date_raises(self, event_service, past_date):
        with pytest.raises(InvalidEventDateError):
            event_service.create_event(
                title="Past Event",
                description="This is in the past",
                date=past_date,
                max_capacity=50,
            )

    def test_create_event_with_now_raises(self, event_service):
        """Event date must be strictly in the future, not at the current moment."""
        with pytest.raises(InvalidEventDateError):
            event_service.create_event(
                title="Now Event",
                description="Right now",
                date=datetime.now(timezone.utc),
                max_capacity=50,
            )


class TestGetEvent:
    def test_get_existing_event(self, event_service, sample_event):
        result = event_service.get_event(sample_event["id"])
        assert result["id"] == sample_event["id"]
        assert result["title"] == sample_event["title"]

    def test_get_nonexistent_event_raises(self, event_service):
        with pytest.raises(EventNotFoundError):
            event_service.get_event(999)


class TestListEvents:
    def test_list_returns_all_events(self, event_service, future_date):
        event_service.create_event("Event A", "Desc", future_date, 10)
        event_service.create_event("Event B", "Desc", future_date + timedelta(days=1), 20)
        events = event_service.list_events()
        assert len(events) == 2

    def test_list_empty_returns_empty_list(self, event_service):
        assert event_service.list_events() == []

    def test_list_sorted_by_date(self, event_service, future_date):
        later = future_date + timedelta(days=10)
        event_service.create_event("Later Event", "Desc", later, 10)
        event_service.create_event("Earlier Event", "Desc", future_date, 10)
        events = event_service.list_events()
        assert events[0]["date"] < events[1]["date"]


class TestUpdateEvent:
    def test_update_title_only(self, event_service, sample_event):
        updated = event_service.update_event(sample_event["id"], title="New Title")
        assert updated["title"] == "New Title"
        assert updated["description"] == sample_event["description"]

    def test_update_with_past_date_raises(self, event_service, sample_event, past_date):
        with pytest.raises(InvalidEventDateError):
            event_service.update_event(sample_event["id"], date=past_date)

    def test_update_nonexistent_event_raises(self, event_service):
        with pytest.raises(EventNotFoundError):
            event_service.update_event(999, title="Ghost Event")

    def test_update_all_fields(self, event_service, sample_event, future_date):
        new_date = future_date + timedelta(days=60)
        updated = event_service.update_event(
            sample_event["id"],
            title="Updated Title",
            description="Updated Desc",
            date=new_date,
            max_capacity=999,
        )
        assert updated["title"] == "Updated Title"
        assert updated["description"] == "Updated Desc"
        assert updated["max_capacity"] == 999


class TestDeleteEvent:
    def test_delete_existing_event(self, event_service, sample_event):
        event_service.delete_event(sample_event["id"])
        with pytest.raises(EventNotFoundError):
            event_service.get_event(sample_event["id"])

    def test_delete_nonexistent_event_raises(self, event_service):
        with pytest.raises(EventNotFoundError):
            event_service.delete_event(999)

    def test_delete_event_cascades_registrations(
        self, event_service, registration_service, sample_event
    ):
        """Deleting an event should remove all its registrations."""
        registration_service.register(sample_event["id"], "user@test.com")
        event_service.delete_event(sample_event["id"])
        # Event is gone — verifying by trying to list registrations should raise
        with pytest.raises(EventNotFoundError):
            registration_service.list_registrations(sample_event["id"])
