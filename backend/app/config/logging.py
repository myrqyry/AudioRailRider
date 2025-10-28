import logging
import sys
import structlog

SENSITIVE_FIELDS = {'password', 'api_key', 'token', 'secret'}

def sanitize_log_data(data):
    """Remove sensitive information from log data."""
    if isinstance(data, dict):
        return {k: '***' if k.lower() in SENSITIVE_FIELDS else v for k, v in data.items()}
    return data

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(message)s",
        stream=sys.stdout,
    )

    structlog.configure(
        processors=[
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            lambda _, __, event_dict: sanitize_log_data(event_dict),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
