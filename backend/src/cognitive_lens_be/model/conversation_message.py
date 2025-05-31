import enum
from pydantic import BaseModel


class Role(str, enum.Enum):
    """Role of the agent."""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ConversationMessage(BaseModel):
    """Single conversation message."""
    role: Role
    content: str
