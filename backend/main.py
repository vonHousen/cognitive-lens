from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from settings import Settings
from src.enums.app import EnvironmentEnum
from src.routers import router as v1_router
from src.utils.logger import Logger
from starlette.middleware.sessions import SessionMiddleware

__all__ = ["app", "aget_application"]


app: FastAPI = FastAPI(
    title=f"cognitive-lens-{Settings.environment.value}",
    version="0.0.1",
)

app.include_router(v1_router)


async def aget_application(scope, receive, send):
    await app(scope, receive, send)
