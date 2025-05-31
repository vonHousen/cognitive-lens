import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from src.enums.app import EnvironmentEnum

__all__ = ["Settings"]

curr_dir = os.path.dirname(os.path.realpath(__file__))
load_dotenv(dotenv_path=curr_dir + "/.env")


class AtlanSettings(BaseSettings):
    api_key: str
    base_url: str

    model_config = SettingsConfigDict(env_prefix="atlan_")


class DatabricksSettings(BaseSettings):
    token: str
    host: str
    http_path: str

    model_config = SettingsConfigDict(env_prefix="dbx_")


class BaseSettingsConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file_encoding="utf-8")
    environment: EnvironmentEnum
    frontend_url: str
    session_secret: str
    atlan: AtlanSettings = AtlanSettings()
    databricks: DatabricksSettings = DatabricksSettings()


class SettingsType(type):
    @lru_cache(maxsize=1)
    def _get_instance(cls):
        return BaseSettingsConfig()

    def __getattr__(cls, attr):
        return getattr(cls._get_instance(), attr)


class Settings(metaclass=SettingsType):
    pass
