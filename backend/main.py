from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from settings import Settings
from src.enums.app import EnvironmentEnum
from src.routers import router as v1_router
from src.utils.logger import Logger
from starlette.middleware.sessions import SessionMiddleware

__all__ = ["app", "aget_application"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    is_deployed = Settings.environment == EnvironmentEnum.PROD or Settings.environment == EnvironmentEnum.DEV
    if is_deployed:
        Logger.info("Initializing elastic handler")
    else:
        Logger.info(f"Environment: {Settings.environment.value}, not initializing elastic handler")

    yield


frontend_urls = [Settings.frontend_url]
if Settings.environment == EnvironmentEnum.LOCALHOST:
    frontend_urls.append(Settings.frontend_url.replace("frontend", "localhost"))

app: FastAPI = FastAPI(
    title=f"Next-Station-Hallucination-H25-{Settings.environment.value}",
    lifespan=lifespan,
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=Settings.session_secret)

app.include_router(v1_router)


async def aget_application(scope, receive, send):
    await app(scope, receive, send)
