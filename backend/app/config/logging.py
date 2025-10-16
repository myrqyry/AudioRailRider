import logging
import sys
import structlog

def setup_logging(log_level: str = "INFO"):
    """
    Configures logging for the application using structlog.

    This setup provides structured, context-aware logging that is easy to read
    in development and can be parsed by logging systems in production.

    Args:
        log_level: The minimum log level to output (e.g., "INFO", "DEBUG").
    """
    # Convert log level string to logging enum
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)

    # Define the shared processors for all logs
    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
    ]

    # Configure structlog to wrap the standard library logger
    structlog.configure(
        processors=shared_processors + [
            # Prepare event dict for the renderer.
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Define the formatter for our logs
    formatter = structlog.stdlib.ProcessorFormatter(
        # These run after the processors defined above
        processor=structlog.dev.ConsoleRenderer(colors=True),
        foreign_pre_chain=shared_processors,
    )

    # Create a handler to output to stdout
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    # Get the root logger and add our handler
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(numeric_level)

    # Set uvicorn log levels to match our configured level
    logging.getLogger("uvicorn.access").setLevel(numeric_level)
    logging.getLogger("uvicorn.error").setLevel(numeric_level)
    logging.getLogger("uvicorn").setLevel(numeric_level)

    logger = structlog.get_logger("main")
    logger.info("Logging configured", log_level=log_level)