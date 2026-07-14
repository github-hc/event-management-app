from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.exceptions import (
    AppError,
    CapacityExceededError,
    DuplicateRegistrationError,
    EventNotFoundError,
    InvalidEventDateError,
    PastEventError,
    RegistrationNotFoundError,
)


def _error_response(status_code: int, error_code: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "error": error_code, "message": message},
    )


async def event_not_found_handler(request: Request, exc: EventNotFoundError) -> JSONResponse:
    return _error_response(404, exc.error_code, exc.message)


async def past_event_handler(request: Request, exc: PastEventError) -> JSONResponse:
    return _error_response(400, exc.error_code, exc.message)


async def capacity_exceeded_handler(request: Request, exc: CapacityExceededError) -> JSONResponse:
    return _error_response(409, exc.error_code, exc.message)


async def duplicate_registration_handler(
    request: Request, exc: DuplicateRegistrationError
) -> JSONResponse:
    return _error_response(409, exc.error_code, exc.message)


async def registration_not_found_handler(
    request: Request, exc: RegistrationNotFoundError
) -> JSONResponse:
    return _error_response(404, exc.error_code, exc.message)


async def invalid_event_date_handler(
    request: Request, exc: InvalidEventDateError
) -> JSONResponse:
    return _error_response(422, exc.error_code, exc.message)


async def generic_app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    """Fallback handler for any AppError not caught by a specific handler."""
    return _error_response(400, exc.error_code, exc.message)


def register_exception_handlers(app) -> None:
    """Register all custom exception handlers with the FastAPI application."""
    app.add_exception_handler(EventNotFoundError, event_not_found_handler)
    app.add_exception_handler(PastEventError, past_event_handler)
    app.add_exception_handler(CapacityExceededError, capacity_exceeded_handler)
    app.add_exception_handler(DuplicateRegistrationError, duplicate_registration_handler)
    app.add_exception_handler(RegistrationNotFoundError, registration_not_found_handler)
    app.add_exception_handler(InvalidEventDateError, invalid_event_date_handler)
    app.add_exception_handler(AppError, generic_app_error_handler)
