import structlog
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi import status

logger = structlog.get_logger(__name__)

from fastapi import HTTPException

async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handles FastAPI HTTPExceptions by returning a structured JSON response.
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
    Handles all other exceptions, logging them and returning a generic
    500 Internal Server Error to the client.
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