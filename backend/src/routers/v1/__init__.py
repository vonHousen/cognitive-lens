from fastapi import APIRouter
from src.utils.logger import Logger

__all__ = ["router"]


router = APIRouter()


@router.get("/")
def read_root():
    Logger.info("Hi mom!")
    return {"message": "Hi mom!"}
