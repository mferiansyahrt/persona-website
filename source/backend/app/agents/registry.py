"""Agent Registry — pola seragam & extensible (modul 04 brief)."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class AgentDefinition:
    id: str
    label: dict[str, str]                 # {"id": "...", "en": "..."}
    description: str
    mode: str                             # "chat" | "task"
    streaming: bool
    system_prompt: str
    tools: list[str] = field(default_factory=list)
    input_schema: dict[str, Any] | None = None
    model: str | None = None              # override model OpenRouter (else default .env)
    guardrails: dict[str, Any] | None = None

    def public(self) -> dict[str, Any]:
        """Bentuk ringkas untuk manifest publik (/api/agents)."""
        return {
            "id": self.id,
            "label": self.label,
            "description": self.description,
            "mode": self.mode,
            "streaming": self.streaming,
            "input_schema": self.input_schema,
        }


class AgentRegistry:
    def __init__(self) -> None:
        self._agents: dict[str, AgentDefinition] = {}

    def register(self, defn: AgentDefinition) -> None:
        self._agents[defn.id] = defn

    def get(self, agent_id: str) -> AgentDefinition | None:
        return self._agents.get(agent_id)

    def manifest(self) -> list[dict[str, Any]]:
        return [a.public() for a in self._agents.values()]


# instance global
registry = AgentRegistry()
