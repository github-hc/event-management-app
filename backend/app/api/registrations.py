from fastapi import APIRouter, status

from app.repositories.event_repository import EventRepository
from app.repositories.registration_repository import RegistrationRepository
from app.schemas.registration import RegistrationRequest, RegistrationResponse
from app.services.registration_service import RegistrationService

router = APIRouter()

# Dependency instances
_event_repo = EventRepository()
_registration_repo = RegistrationRepository()
_service = RegistrationService(event_repo=_event_repo, registration_repo=_registration_repo)


@router.get(
    "/events/{event_id}/registrations",
    response_model=list[RegistrationResponse],
    summary="List registrations for an event",
    description="Returns all users registered for a specific event.",
)
def list_registrations(event_id: int):
    return _service.list_registrations(event_id)


@router.post(
    "/events/{event_id}/register",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a user for an event",
    description=(
        "Registers a user for an event. "
        "Enforces business rules: event must be in the future, "
        "capacity must not be exceeded, and the user cannot register twice."
    ),
)
def register(event_id: int, payload: RegistrationRequest):
    return _service.register(event_id=event_id, user_email=payload.user_email)


@router.delete(
    "/events/{event_id}/unregister",
    status_code=status.HTTP_200_OK,
    summary="Unregister a user from an event",
    description="Removes a user's registration from an event.",
)
def unregister(event_id: int, payload: RegistrationRequest):
    _service.unregister(event_id=event_id, user_email=payload.user_email)
    return {"success": True, "message": f"User '{payload.user_email}' unregistered successfully."}
