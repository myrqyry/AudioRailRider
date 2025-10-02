from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi import status

async def http_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

async def generic_exception_handler(request: Request, exc: Exception):
    # Log the exception for debugging purposes
    print(f"An unexpected error occurred: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred."},
    )