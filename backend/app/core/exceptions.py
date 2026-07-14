class AppError(Exception):
    """Base application error. All custom errors should inherit from this."""

    def __init__(self, message: str, error_code: str):
        self.message = message
        self.error_code = error_code
        super().__init__(message)


class EventNotFoundError(AppError):
    """Raised when the requested event does not exist."""

    def __init__(self, event_id: int):
        super().__init__(
            message=f"Event with id {event_id} not found.",
            error_code="EVENT_NOT_FOUND",
        )


class PastEventError(AppError):
    """Raised when attempting to register for an event that has already passed."""

    def __init__(self, event_id: int):
        super().__init__(
            message=f"Cannot register for event {event_id} — it is in the past.",
            error_code="PAST_EVENT",
        )


class CapacityExceededError(AppError):
    """Raised when an event has reached its maximum registration capacity."""

    def __init__(self, event_id: int):
        super().__init__(
            message=f"Event {event_id} has reached its maximum capacity.",
            error_code="CAPACITY_EXCEEDED",
        )


class DuplicateRegistrationError(AppError):
    """Raised when a user attempts to register for an event they are already registered for."""

    def __init__(self, event_id: int, user_email: str):
        super().__init__(
            message=f"User '{user_email}' is already registered for event {event_id}.",
            error_code="DUPLICATE_REGISTRATION",
        )


class RegistrationNotFoundError(AppError):
    """Raised when a registration record cannot be found."""

    def __init__(self, event_id: int, user_email: str):
        super().__init__(
            message=f"No registration found for user '{user_email}' on event {event_id}.",
            error_code="REGISTRATION_NOT_FOUND",
        )


class InvalidEventDateError(AppError):
    """Raised when an event date is set to the past during creation or update."""

    def __init__(self):
        super().__init__(
            message="Event date must be in the future.",
            error_code="INVALID_EVENT_DATE",
        )
