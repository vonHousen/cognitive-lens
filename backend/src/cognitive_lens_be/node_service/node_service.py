import litellm
import httpx
from litellm import acompletion, BadRequestError
from agents import Agent, Runner, trace

from cognitive_lens_be.model.conversation_message import ConversationMessage, ConversationRole
from cognitive_lens_be.model.message import Message, AgentRole
from cognitive_lens_be.model.result_messages import ResultMessages
from cognitive_lens_be.utils.logger import LOGGER
from cognitive_lens_be.agents.supervising_agent import (
    INSTRUCTIONS as SUPERVISING_AGENT_INSTRUCTIONS,
    SupervisingAgentResponse,
    MAX_TURNS
)
from cognitive_lens_be.agents.judge_contextual_analyzer import (
    INSTRUCTIONS as JUDGE_CONTEXTUAL_ANALYZER_INSTRUCTIONS,
    AGENT_DESCRIPTION as JUDGE_CONTEXTUAL_ANALYZER_DESCRIPTION,
)
from cognitive_lens_be.agents.judge_creative_thinker import (
    INSTRUCTIONS as JUDGE_CREATIVE_THINKER_INSTRUCTIONS,
    AGENT_DESCRIPTION as JUDGE_CREATIVE_THINKER_DESCRIPTION,
)
from cognitive_lens_be.agents.judge_detail_oriented import (
    INSTRUCTIONS as JUDGE_DETAIL_ORIENTED_INSTRUCTIONS,
    AGENT_DESCRIPTION as JUDGE_DETAIL_ORIENTED_DESCRIPTION,
)


class NodeService:
    """All actions related to running the node."""

    _supervising_agent: Agent
    _feedback_max_rounds: int

    def __init__(self):
        litellm.aclient_session = httpx.AsyncClient(verify=False)   # TODO hacks to make it work

        judge_contextual_analyzer = Agent(
            name="judge_contextual_analyzer",
            instructions=JUDGE_CONTEXTUAL_ANALYZER_INSTRUCTIONS,
            model="gpt-4.1-mini",
        )
        judge_creative_thinker = Agent(
            name="judge_creative_thinker",
            instructions=JUDGE_CREATIVE_THINKER_INSTRUCTIONS,
            model="gpt-4.1-mini",
        )
        judge_detail_oriented = Agent(
            name="judge_detail_oriented",
            instructions=JUDGE_DETAIL_ORIENTED_INSTRUCTIONS,
            model="gpt-4.1-mini",
        )

        self._supervising_agent = Agent(
            name="supervising_agent",
            instructions=SUPERVISING_AGENT_INSTRUCTIONS,
            model="gpt-4.1-mini",
            output_type=SupervisingAgentResponse,
            tools=[
                judge_contextual_analyzer.as_tool(
                    tool_name="judge_contextual_analyzer",
                    tool_description=JUDGE_CONTEXTUAL_ANALYZER_DESCRIPTION,
                ),
                judge_creative_thinker.as_tool(
                    tool_name="judge_creative_thinker",
                    tool_description=JUDGE_CREATIVE_THINKER_DESCRIPTION,
                ),
                judge_detail_oriented.as_tool(
                    tool_name="judge_detail_oriented",
                    tool_description=JUDGE_DETAIL_ORIENTED_DESCRIPTION,
                ),
            ]
        )
        self._feedback_max_rounds = 3

    async def get_response(
            self,
            conversation: list[ConversationMessage],
            system_prompt: str | None,
            output_schema: dict | None,
    ) -> ResultMessages:
        """Run the agent with the provided prompt."""
        feedback_rounds = 0
        thinking_process = []
        executor_input_messages = [{
            "content": system_prompt, "role": ConversationRole.SYSTEM
        }] if system_prompt else []
        executor_input_messages.extend([msg.model_dump() for msg in conversation])

        with trace("executor-evaluation"):
            while feedback_rounds < self._feedback_max_rounds:
                try:
                    executor_initial_response = await acompletion(
                        model="gpt-4.1-mini",
                        messages=executor_input_messages,
                        response_format=output_schema or None,
                    )
                except BadRequestError:
                    LOGGER.exception("Error while LLM requesting.")
                    raise

                executor_msg = executor_initial_response.choices[0].message.content
                LOGGER.info(f"Executor response: '{executor_msg}'.")

                conversation_history = executor_input_messages.copy()
                conversation_history.append({"content": executor_msg, "role": ConversationRole.ASSISTANT})
                thinking_process.append({"content": executor_msg, "role": AgentRole.EXECUTOR})

                supervision_result = await Runner.run(
                    self._supervising_agent,
                    input=conversation_history,
                    max_turns=MAX_TURNS,
                )
                supervisor_feedback: SupervisingAgentResponse = supervision_result.final_output
                LOGGER.info(f"Supervising agent feedback: '{supervisor_feedback.model_dump()}'.")

                feedback_rounds += 1
                thinking_process.append(Message(content=supervisor_feedback.feedback, role=AgentRole.SUPERVISOR))
                executor_input_messages.append(
                    {"content": supervisor_feedback.feedback, "role": ConversationRole.SYSTEM}
                )

                if supervisor_feedback.is_executor_response_valid:
                    break

        return ResultMessages(
            output_message=Message(content=executor_msg, role=AgentRole.EXECUTOR),
            thinking_process=thinking_process,
        )
