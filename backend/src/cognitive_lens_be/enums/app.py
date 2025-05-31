from enum import Enum

__all__ = ["EnvironmentEnum"]


class EnvironmentEnum(str, Enum):
    PROD = "prod"
    DEV = "dev"
    LOCALHOST = "localhost"
