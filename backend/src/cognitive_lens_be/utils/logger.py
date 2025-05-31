import logging

__all__ = ["LOGGER"]


LOGGER = logging.getLogger("backend")
LOGGER.setLevel(logging.DEBUG)

formatter = logging.Formatter(
    fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
handler = logging.StreamHandler()
handler.setFormatter(formatter)
LOGGER.addHandler(handler)
