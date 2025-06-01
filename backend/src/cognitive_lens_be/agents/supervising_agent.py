from pydantic import BaseModel

INSTRUCTIONS = (
    "You are a supervisor that helps the executor agent do the task it is given. "
    "Your task is to pass the feedback to the executor based solely on the jury you work with. "
    "Converse with ALL the jury members and collect their feedback, by passing them all the necessary context in the concise "
    "form. "
    "Whenever majority of the jury members are not satisfied with the executor response, you provide jury unified feedback "
    "and mark that the response is not valid."
    "REMEMBER! You are not allowed to introduce any feedback by yourself. Always rely on the jury's feedback."
)
MAX_TURNS = 10

class JudgeAgentResponse(BaseModel):
    is_executor_response_valid: bool
    """Determines if the executor response is valid, or if it should generate a new one."""
    feedback: str
    """Feedback to the executor, what should be fixed by the executor in the new response."""
