import enum
from pydantic import BaseModel


class ConversationRole(str, enum.Enum):
    """Role of the agent."""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ConversationMessage(BaseModel):
    """Single conversation message."""
    role: ConversationRole
    content: str
