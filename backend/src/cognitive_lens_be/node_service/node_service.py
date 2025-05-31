from litellm import acompletion

from cognitive_lens_be.model.message import Message, AgentRole
from cognitive_lens_be.model.result_messages import ResultMessages


class NodeService:
    """All actions related to running the node."""

    # TODO add supervisor
    async def run(self, prompt: str, system_prompt: str | None) -> ResultMessages:
        """Run the agent with the provided prompt."""
        executor_input_messages = [{"content": system_prompt, "role": "system"}] if system_prompt else []
        executor_input_messages.append({"content": prompt, "role": "user"})

        executor_initial_response = await acompletion(
            model="gpt-4.1-mini",
            messages=executor_input_messages,
        )
        executor_msg = executor_initial_response.choices[0].message.content

        # TODO add feedback loop
        return ResultMessages(
            output_message=Message(content=executor_msg, role=AgentRole.EXECUTOR),
            thinking_process=[],
        )
