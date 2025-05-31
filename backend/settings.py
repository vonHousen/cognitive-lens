import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from src.enums.app import EnvironmentEnum

__all__ = ["Settings"]

curr_dir = os.path.dirname(os.path.realpath(__file__))
load_dotenv(dotenv_path=curr_dir + "/.env")


class BaseSettingsConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file_encoding="utf-8")
    environment: EnvironmentEnum
    frontend_url: str
    session_secret: str
    openai_api_key: str


class SettingsType(type):
    @lru_cache(maxsize=1)
    def _get_instance(cls):
        return BaseSettingsConfig()

    def __getattr__(cls, attr):
        return getattr(cls._get_instance(), attr)


class Settings(metaclass=SettingsType):
    pass
