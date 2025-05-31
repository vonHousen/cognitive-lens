import logging
import sys
from functools import lru_cache
from typing import Union

__all__ = ["Logger"]


def _setup_logger() -> Union[logging.Logger, None]:
    _logger = logging.getLogger("custom_logger")
    _logger.setLevel(logging.INFO)

    # Always add a console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    console_handler.setFormatter(console_formatter)
    _logger.addHandler(console_handler)

    return _logger


class CustomLogger:
    def __init__(self, capture_uvicorn_logs: bool = False):
        self.logger = _setup_logger()
        if capture_uvicorn_logs:
            self._capture_uvicorn_logs()

    def info(self, msg, *args, **kwargs):
        if self.logger:
            self.logger.info(msg, *args, **kwargs)

    def error(self, msg, *args, **kwargs):
        if self.logger:
            self.logger.error(msg, *args, **kwargs)

    def warning(self, msg, *args, **kwargs):
        if self.logger:
            self.logger.warning(msg, *args, **kwargs)

    def debug(self, msg, *args, **kwargs):
        if self.logger:
            self.logger.debug(msg, *args, **kwargs)

    def _capture_uvicorn_logs(self):
        """Configure the Uvicorn loggers to use our custom format."""
        try:
            # Create our formatter
            formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

            # Create a handler with our formatter
            handler = logging.StreamHandler(sys.stdout)
            handler.setFormatter(formatter)

            # Configure Uvicorn's access logger
            uvicorn_access = logging.getLogger("uvicorn.access")
            uvicorn_access.handlers.clear()
            uvicorn_access.addHandler(handler)

            # Configure Uvicorn's error logger
            uvicorn_error = logging.getLogger("uvicorn.error")
            uvicorn_error.handlers.clear()
            uvicorn_error.addHandler(handler)

            # Also capture the main Uvicorn logger
            uvicorn_main = logging.getLogger("uvicorn")
            uvicorn_main.handlers.clear()
            uvicorn_main.addHandler(handler)

            self.info("Uvicorn loggers configured with custom formatter")
        except Exception as e:
            self.error(f"Failed to capture Uvicorn logs: {str(e)}")


# Singleton implementation using metaclass like Settings
class LoggerType(type):
    @lru_cache(maxsize=1)
    def _get_instance(cls):
        return CustomLogger(capture_uvicorn_logs=True)

    def __getattr__(cls, attr):
        return getattr(cls._get_instance(), attr)


class Logger(metaclass=LoggerType):
    pass
