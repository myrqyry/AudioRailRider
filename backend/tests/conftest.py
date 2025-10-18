import pytest
from app.limiter import limiter

@pytest.fixture(autouse=True)
def override_rate_limiter():
    """
    Fixture to automatically disable the rate limiter for all tests.
    """
    limiter.enabled = False
    yield
    limiter.enabled = True