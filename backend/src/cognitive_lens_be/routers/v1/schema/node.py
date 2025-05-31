from typing import Annotated

from pydantic import BaseModel, Field

class Node(BaseModel):
    """Node definition to be executed by the LLM agent."""
    system_prompt: Annotated[str | None, Field(min_length=1)] = None
    prompt: Annotated[str, Field(min_length=1)]
