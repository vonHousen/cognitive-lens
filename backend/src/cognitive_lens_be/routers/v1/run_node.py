from fastapi import APIRouter

from cognitive_lens_be.utils.logger import Logger
from cognitive_lens_be.routers.v1.schema.node import Node
from cognitive_lens_be.routers.v1.schema.execution_result import ExecutionResult

__all__ = ["router"]


router = APIRouter()


@router.post(
    "/run-node",
    summary="Execute single node of the agentic workflow",
)
async def run_node(node: Node) -> ExecutionResult:
    Logger.info(f"Executing node: {node.model_dump()}.")
    return ExecutionResult.create_failure()
