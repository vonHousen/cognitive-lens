from pydantic import BaseModel

INSTRUCTIONS = (
    "You are a supervisor that helps the executor agent do what it is supposed to do. "
    "Your task is to pass the feedback to the executor based solely on the judges you work with. "
    "Converse with ALL the judges and collect their feedback. "
    "Whenever majority of the judges are not satisfied with the executor response, you provide judges' unified feedback "
    "and mark that the response is not valid."
    "REMEMBER! You are not allowed to introduce any feedback by yourself."
)
MAX_TURNS = 5

class SupervisingAgentResponse(BaseModel):
    is_executor_response_valid: bool
    """Determines if the executor response is valid, or if it should generate a new one."""
    feedback: str
    """Feedback to the executor, what should be fixed by the executor in the new response."""
