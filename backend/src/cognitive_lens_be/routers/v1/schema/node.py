from typing import Annotated

from pydantic import BaseModel, Field

from cognitive_lens_be.model.conversation_message import ConversationMessage


class Node(BaseModel):
    """Node definition to be executed by the LLM agent."""
    conversation: Annotated[list[ConversationMessage], Field(min_length=1)]

    model_name_executor: Annotated[str, Field(min_length=1)] = "gpt-4.1-mini"
    model_name_judge: Annotated[str, Field(min_length=1)] = "gpt-4.1-mini"
    model_name_supervisor: Annotated[str, Field(min_length=1)] = "gpt-4.1-mini"
    system_prompt: Annotated[str | None, Field(min_length=1)] = None
    output_schema: Annotated[dict | None, Field(min_length=1)] = None
