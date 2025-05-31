from typing import Any

from litellm import acompletion, BadRequestError

from cognitive_lens_be.model.conversation_message import ConversationMessage
from cognitive_lens_be.model.message import Message, AgentRole
from cognitive_lens_be.model.result_messages import ResultMessages
from cognitive_lens_be.utils.logger import LOGGER


class NodeService:
    """All actions related to running the node."""

    # TODO add supervisor
    async def run(
            self,
            conversation: list[ConversationMessage],
            system_prompt: str | None,
            output_schema: dict | None,
    ) -> ResultMessages:
        """Run the agent with the provided prompt."""
        executor_input_messages = [{"content": system_prompt, "role": "system"}] if system_prompt else []
        executor_input_messages.extend([msg.model_dump() for msg in conversation])

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

        # TODO add feedback loop
        return ResultMessages(
            output_message=Message(content=executor_msg, role=AgentRole.EXECUTOR),
            thinking_process=[],
        )
