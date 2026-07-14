"""
Shared pytest fixtures for unit tests.
Each test gets fresh, isolated instances of repositories and services.
"""
import pytest
from datetime import datetime, timedelta, timezone

from app.repositories.event_repository import EventRepository
from app.repositories.registration_repository import RegistrationRepository
from app.repositories.memory_db import MemoryDB
from app.services.event_service import EventService
from app.services.registration_service import RegistrationService


@pytest.fixture(autouse=True)
def reset_db():
    """
    Reset the in-memory database before every test.
    This ensures complete test isolation without needing mocks.
    """
    from app.repositories import memory_db
    memory_db.db.events.clear()
    memory_db.db.registrations.clear()
    memory_db.db.event_counter = 1
    memory_db.db.registration_counter = 1
    yield


@pytest.fixture
def event_repo():
    return EventRepository()


@pytest.fixture
def registration_repo():
    return RegistrationRepository()


@pytest.fixture
def event_service(event_repo, registration_repo):
    return EventService(event_repo=event_repo, registration_repo=registration_repo)


@pytest.fixture
def registration_service(event_repo, registration_repo):
    return RegistrationService(event_repo=event_repo, registration_repo=registration_repo)


@pytest.fixture
def future_date():
    """A timezone-aware datetime guaranteed to be in the future."""
    return datetime.now(timezone.utc) + timedelta(days=30)


@pytest.fixture
def past_date():
    """A timezone-aware datetime guaranteed to be in the past."""
    return datetime.now(timezone.utc) - timedelta(days=1)


@pytest.fixture
def sample_event(event_service, future_date):
    """A pre-created event with capacity 2 for use in registration tests."""
    return event_service.create_event(
        title="Tech Conference 2027",
        description="A great tech conference.",
        date=future_date,
        max_capacity=2,
    )
