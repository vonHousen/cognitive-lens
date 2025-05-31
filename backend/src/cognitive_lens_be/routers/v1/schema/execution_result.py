from pydantic import BaseModel

from cognitive_lens_be.model.result_messages import ResultMessages


class ExecutionResult(BaseModel):
    """Execution result of the single node."""
    success: bool = True
    messages: ResultMessages | None
    """Messages being a result of executing a single node."""

    @classmethod
    def create_failure(cls) -> "ExecutionResult":
        return cls(success=False, messages=None)
