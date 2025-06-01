import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


__all__ = ["Settings"]

curr_dir = os.path.dirname(os.path.realpath(__file__))
load_dotenv(dotenv_path=curr_dir + "/.env")     # TODO is it necessary?


class BaseSettingsConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file_encoding="utf-8")
    session_secret: SecretStr
    frontend_url: str
    openai_api_key: SecretStr


class SettingsType(type):
    @lru_cache(maxsize=1)
    def _get_instance(cls):
        return BaseSettingsConfig()

    def __getattr__(cls, attr):
        return getattr(cls._get_instance(), attr)


class Settings(metaclass=SettingsType):
    pass
