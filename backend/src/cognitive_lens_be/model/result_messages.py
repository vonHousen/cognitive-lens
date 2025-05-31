from pydantic import BaseModel

from cognitive_lens_be.model.message import Message


class ResultMessages(BaseModel):
    """Messages being a result of executing a single node."""
    output_message: Message
    """The final result of the node execution."""
    thinking_process: list[Message]
    """The thinking process, including the supervisor's thoughts."""
