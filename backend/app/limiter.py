from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# --- Rate Limiter Configuration ---
# Initialize a Limiter instance.
# - get_remote_address is used to identify the client by their IP address.
# - default_limits sets a global rate limit for all endpoints that are not explicitly decorated.
#   Here, we set it to 5 requests per minute as a sensible default to prevent abuse.
limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])