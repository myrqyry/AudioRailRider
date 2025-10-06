from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router
from app.config.settings import settings
from app.limiter import limiter
from app.exceptions import http_exception_handler, generic_exception_handler
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
import uvicorn

# --- FastAPI App Setup ---
app = FastAPI(
    title="AudioRailRider Backend",
    description="Backend API for AudioRailRider",
    version="0.1.0"
)

# --- Exception Handlers ---
# Register centralized exception handlers to ensure consistent error responses.
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# --- Rate Limiting ---
# Add the rate limiter to the application's state and register the exception handler.
# This ensures that any requests exceeding the defined rate limits are properly handled
# and a 429 Too Many Requests response is returned.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- CORS Configuration ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # "https://your-frontend-domain.com", # Placeholder for production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# --- Router ---
app.include_router(router)

# --- Main ---
if __name__ == "__main__":
    try:
        # Pydantic will raise a validation error if GEMINI_API_KEY is missing
        settings
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except ValueError as e:
        print(f"FATAL: Configuration error - {e}. The application cannot start.")