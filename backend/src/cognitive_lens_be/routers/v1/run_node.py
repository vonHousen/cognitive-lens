from fastapi import APIRouter

from cognitive_lens_be.utils.logger import LOGGER
from cognitive_lens_be.routers.v1.schema.node import Node
from cognitive_lens_be.routers.v1.schema.execution_result import ExecutionResult
from cognitive_lens_be.node_service import NodeService

__all__ = ["router"]


router = APIRouter()


@router.post(
    "/run-node",
    summary="Execute single node of the agentic workflow",
)
async def run_node(node: Node) -> ExecutionResult:
    LOGGER.info(f"Executing node: {node.model_dump()}.")
    service = NodeService()

    try:
        result = await service.get_response(
            conversation=node.conversation,
            system_prompt=node.system_prompt,
            output_schema=node.output_schema,
        )
    except:
        LOGGER.exception("Unexpected error while executing node.")
        return ExecutionResult.create_failure()

    LOGGER.info(
        "Node execution completed successfully. "
        f"Thinking process messages: {[msg.model_dump() for msg in result.thinking_process]}. "
        f"Final result message: {result.output_message.model_dump()}."
    )
    return ExecutionResult(
        success=True,
        messages=result,
    )
