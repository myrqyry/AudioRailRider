import asyncio
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.config.settings import settings

class TimeoutMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.timeout = settings.REQUEST_TIMEOUT

    async def dispatch(self, request: Request, call_next):
        try:
            return await asyncio.wait_for(call_next(request), timeout=self.timeout)
        except asyncio.TimeoutError:
            return Response("Request timed out", status_code=504)
