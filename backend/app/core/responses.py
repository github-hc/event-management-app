from typing import Any

from pydantic import BaseModel


class SuccessResponse(BaseModel):
    """Standard envelope for successful API responses."""

    success: bool = True
    message: str
    data: Any = None


class ErrorResponse(BaseModel):
    """Standard envelope for error API responses."""

    success: bool = False
    error: str
    message: str
