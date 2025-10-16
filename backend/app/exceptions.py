import structlog
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi import status

logger = structlog.get_logger(__name__)

from fastapi import HTTPException

async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Custom exception handler for FastAPI's HTTPException.

    This handler logs the exception and returns a standardized JSON error response.

    Args:
        request: The incoming request object.
        exc: The HTTPException instance.

    Returns:
        A JSONResponse with the appropriate status code and error detail.
    """
    logger.error(
        "HTTP Exception",
        method=request.method,
        url=str(request.url),
        status_code=exc.status_code,
        detail=exc.detail,
        exc_info=True
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """
    Catch-all exception handler for any unhandled exceptions.

    This prevents sensitive error details from leaking to the client and ensures
    all critical errors are logged.

    Args:
        request: The incoming request object.
        exc: The Exception instance.

    Returns:
        A JSONResponse with a generic 500 Internal Server Error message.
    """
    logger.critical(
        "Unhandled Exception",
        method=request.method,
        url=str(request.url),
        error_type=type(exc).__name__,
        error=str(exc),
        exc_info=True
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred."},
    )