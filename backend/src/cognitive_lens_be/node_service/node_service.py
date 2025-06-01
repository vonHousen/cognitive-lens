import json

import litellm
import httpx
from litellm import acompletion, BadRequestError
from agents import Agent, Runner, trace
from openai.types.responses import ResponseOutputItemDoneEvent, ResponseFunctionToolCall, ResponseTextDeltaEvent

from cognitive_lens_be.model.conversation_message import ConversationMessage, ConversationRole
from cognitive_lens_be.model.message import Message, AgentRole
from cognitive_lens_be.model.result_messages import ResultMessages
from cognitive_lens_be.utils.logger import LOGGER
from cognitive_lens_be.agents.supervising_agent import (
    INSTRUCTIONS as SUPERVISING_AGENT_INSTRUCTIONS,
    JudgeAgentResponse,
    MAX_TURNS
)
from cognitive_lens_be.agents.judge_abstract import JuryMemberResponse
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

    def __init__(self, model_name_supervisor: str, model_name_judge: str):
        litellm.aclient_session = httpx.AsyncClient(verify=False)   # TODO hacks to make it work

        judge_contextual_analyzer = Agent(
            name="jury_contextual_analyzer",
            instructions=JUDGE_CONTEXTUAL_ANALYZER_INSTRUCTIONS,
            model=model_name_judge,
            output_type=JuryMemberResponse,
        )
        judge_creative_thinker = Agent(
            name="jury_creative_thinker",
            instructions=JUDGE_CREATIVE_THINKER_INSTRUCTIONS,
            model=model_name_judge,
            output_type=JuryMemberResponse,
        )
        judge_detail_oriented = Agent(
            name="jury_detail_oriented",
            instructions=JUDGE_DETAIL_ORIENTED_INSTRUCTIONS,
            model=model_name_judge,
            output_type=JuryMemberResponse,
        )

        self._supervising_agent = Agent(
            name="judge_agent",
            instructions=SUPERVISING_AGENT_INSTRUCTIONS,
            model=model_name_supervisor,
            output_type=JudgeAgentResponse,
            tools=[
                judge_contextual_analyzer.as_tool(
                    tool_name="jury_contextual_analyzer",
                    tool_description=JUDGE_CONTEXTUAL_ANALYZER_DESCRIPTION,
                ),
                judge_creative_thinker.as_tool(
                    tool_name="jury_creative_thinker",
                    tool_description=JUDGE_CREATIVE_THINKER_DESCRIPTION,
                ),
                judge_detail_oriented.as_tool(
                    tool_name="jury_detail_oriented",
                    tool_description=JUDGE_DETAIL_ORIENTED_DESCRIPTION,
                ),
            ]
        )
        self._feedback_max_rounds = 3

    def _parse_executor_message(self, content: str) -> Message:
        """Parse executor message and extract structured data if available."""
        structured_data = None
        try:
            parsed_json = json.loads(content)
            if isinstance(parsed_json, dict):
                structured_data = parsed_json
        except (json.JSONDecodeError, TypeError):
            pass
        
        return Message(
            content=content,
            role=AgentRole.EXECUTOR,
            structured_data=structured_data
        )

    async def get_response(
            self,
            conversation: list[ConversationMessage],
            executor_model_name: str,
            output_schema: dict | None,
    ) -> ResultMessages:
        """Run the agent with the provided prompt."""
        feedback_rounds = 0
        thinking_process = []
        executor_input_messages = [msg.model_dump() for msg in conversation]

        with trace("executor-evaluation"):
            while feedback_rounds < self._feedback_max_rounds:
                try:
                    executor_initial_response = await acompletion(
                        model=executor_model_name,
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
                thinking_process.append(self._parse_executor_message(executor_msg))

                supervision_result_stream = Runner.run_streamed(
                    self._supervising_agent,
                    input=conversation_history,
                    max_turns=MAX_TURNS,
                )
                supervision_result = ""
                async for event in supervision_result_stream.stream_events():
                    if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
                        supervision_result += event.data.delta
                    elif event.type == "agent_updated_stream_event":
                        LOGGER.info(f"Using Agent: {event.new_agent.name}.")
                    elif (
                        event.type == "raw_response_event"
                        and isinstance(event.data, ResponseOutputItemDoneEvent)
                        and isinstance(event.data.item, ResponseFunctionToolCall)
                    ):
                        agent_input = json.loads(event.data.item.arguments).get("input", "")
                        truncated_input = agent_input
                        LOGGER.debug(
                            f"Using Tool '{event.data.item.name}': '{truncated_input}'."
                        )
                    elif event.type == "run_item_stream_event" and event.item.type == "tool_call_output_item":
                        judge_msg = JuryMemberResponse.model_validate_json(event.item.output)
                        LOGGER.debug(f"Tool output: {judge_msg.model_dump()}.")
                        thinking_process.append(Message(
                            content=judge_msg.feedback,
                            role=AgentRole.JUDGE,
                            structured_data=judge_msg.model_dump(),
                            decision=judge_msg.is_task_good_enough
                        ))

                supervisor_feedback = JudgeAgentResponse.model_validate_json(supervision_result)
                LOGGER.info(f"Supervising agent feedback: '{supervisor_feedback.model_dump()}'.")

                feedback_rounds += 1
                thinking_process.append(Message(
                    content=supervisor_feedback.feedback,
                    role=AgentRole.SUPERVISOR,
                    structured_data=supervisor_feedback.model_dump(),
                    decision=supervisor_feedback.is_ai_agent_response_valid
                ))
                executor_input_messages.append(
                    {"content": supervisor_feedback.feedback, "role": ConversationRole.SYSTEM}
                )

                if supervisor_feedback.is_ai_agent_response_valid:
                    break

        return ResultMessages(
            output_message=self._parse_executor_message(executor_msg),
            thinking_process=thinking_process,
        )
