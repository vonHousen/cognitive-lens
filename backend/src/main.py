from fastapi import FastAPI

from .settings import Settings
from cognitive_lens_be.routers.v1.run_node import router as v1_router

__all__ = ["app", "aget_application"]


app: FastAPI = FastAPI(
    title=f"cognitive-lens-{Settings.environment.value}",
    version="0.0.1",
)

app.include_router(v1_router)


async def aget_application(scope, receive, send):
    await app(scope, receive, send)
