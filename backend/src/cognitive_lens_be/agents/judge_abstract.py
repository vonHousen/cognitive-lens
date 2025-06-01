from pydantic import BaseModel

INSTRUCTIONS = (
    "You are a judge that helps the executor agent do what it is supposed to do AND evaluates the executor's response. "
    "Your task is to (1) determine if the task was done good enough and (2) provide the executor with constructive "
    "feedback. "
)
AGENT_DESCRIPTION = (
    "Provide it with (1) the task description the executor agent was assigned with; (2) the executor's response; "
    "(3) all the necessary context to perform evaluation effectively. "
)

class JudgeResponse(BaseModel):
    is_task_good_enough: bool
    """Determines if the task is done good enough, or if it should be generated again given your feedback."""
    feedback: str
    """Feedback to the executor, what should be fixed by the executor in the new response."""
