from typing import Annotated, Any

from pydantic import BaseModel, Field

from cognitive_lens_be.model.conversation_message import ConversationMessage


class Node(BaseModel):
    """Node definition to be executed by the LLM agent."""
    system_prompt: Annotated[str | None, Field(min_length=1)] = None
    conversation: Annotated[list[ConversationMessage], Field(min_length=1)]
    output_schema: Annotated[dict | None, Field(min_length=1)] = None
