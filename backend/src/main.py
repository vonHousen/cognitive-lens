from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from cognitive_lens_be.routers.v1.run_node import router as v1_router

__all__ = ["app", "aget_application"]


app: FastAPI = FastAPI(
    title=f"cognitive-lens",
    version="0.0.1",
)

app.include_router(v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def aget_application(scope, receive, send):
    await app(scope, receive, send)
