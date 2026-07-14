from fastapi import APIRouter, status

from app.repositories.event_repository import EventRepository
from app.repositories.registration_repository import RegistrationRepository
from app.schemas.event import EventCreate, EventResponse, EventUpdate
from app.services.event_service import EventService

router = APIRouter()

# Dependency instances (simple instantiation — no database connection needed)
_event_repo = EventRepository()
_registration_repo = RegistrationRepository()
_service = EventService(event_repo=_event_repo, registration_repo=_registration_repo)


@router.get(
    "",
    response_model=list[EventResponse],
    summary="List all events",
    description="Returns all events sorted by date, each enriched with registration count and available spots.",
)
def list_events():
    return _service.list_events()


@router.get(
    "/{event_id}",
    response_model=EventResponse,
    summary="Get a single event",
    description="Returns a specific event by its ID, including current registration stats.",
)
def get_event(event_id: int):
    return _service.get_event(event_id)


@router.post(
    "",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new event",
    description="Creates a new event. The event date must be in the future.",
)
def create_event(payload: EventCreate):
    return _service.create_event(
        title=payload.title,
        description=payload.description,
        date=payload.date,
        max_capacity=payload.max_capacity,
    )


@router.put(
    "/{event_id}",
    response_model=EventResponse,
    summary="Update an event",
    description="Partially update an event's fields. Only provided fields are updated.",
)
def update_event(event_id: int, payload: EventUpdate):
    return _service.update_event(
        event_id=event_id,
        title=payload.title,
        description=payload.description,
        date=payload.date,
        max_capacity=payload.max_capacity,
    )


@router.delete(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an event",
    description="Deletes an event and all its associated registrations (cascade delete).",
)
def delete_event(event_id: int):
    _service.delete_event(event_id)
