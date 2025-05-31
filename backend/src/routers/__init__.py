from fastapi import APIRouter
from src.routers.v1 import router as v1_router
from src.utils.logger import Logger

__all__ = ["router"]


router = APIRouter()

router.include_router(v1_router, prefix="/v1")


@router.get("/")
async def index():
    Logger.info("API is running")
    return {"message": "API is running"}
