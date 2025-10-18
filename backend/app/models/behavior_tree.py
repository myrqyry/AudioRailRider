from enum import Enum
from typing import Any, Dict

class BehaviorTreeStatus(Enum):
    """Execution status of a behavior tree node."""
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"
    RUNNING = "RUNNING"

class Blackboard:
    """A simple key-value store for sharing data between nodes."""
    def __init__(self):
        self._data: Dict[str, Any] = {}

    def set(self, key: str, value: Any):
        self._data[key] = value

    def get(self, key: str, default: Any = None) -> Any:
        return self._data.get(key, default)

    def has(self, key: str) -> bool:
        return key in self._data

class Context:
    """Execution context passed to each node during a tick."""
    def __init__(self, blackboard: Blackboard, audio_features: Dict[str, Any]):
        self.blackboard = blackboard
        self.audio_features = audio_features

class Node:
    """Base class for all behavior tree nodes."""
    def tick(self, context: Context) -> BehaviorTreeStatus:
        raise NotImplementedError

class Composite(Node):
    """Base class for nodes that have one or more children."""
    def __init__(self, children: list[Node]):
        self.children = children

class Sequence(Composite):
    """
    Executes children sequentially until one fails.
    - If a child returns FAILURE, the Sequence fails.
    - If a child returns RUNNING, the Sequence is still running.
    - If all children return SUCCESS, the Sequence succeeds.
    """
    def tick(self, context: Context) -> BehaviorTreeStatus:
        for child in self.children:
            status = child.tick(context)
            if status != BehaviorTreeStatus.SUCCESS:
                return status
        return BehaviorTreeStatus.SUCCESS

class Selector(Composite):
    """
    Executes children sequentially until one succeeds.
    - If a child returns SUCCESS, the Selector succeeds.
    - If a child returns RUNNING, the Selector is still running.
    - If all children return FAILURE, the Selector fails.
    """
    def tick(self, context: Context) -> BehaviorTreeStatus:
        for child in self.children:
            status = child.tick(context)
            if status != BehaviorTreeStatus.FAILURE:
                return status
        return BehaviorTreeStatus.FAILURE

class Decorator(Node):
    """Base class for nodes that have a single child."""
    def __init__(self, child: Node):
        self.child = child

class Inverter(Decorator):
    """Inverts the result of its child."""
    def tick(self, context: Context) -> BehaviorTreeStatus:
        status = self.child.tick(context)
        if status == BehaviorTreeStatus.SUCCESS:
            return BehaviorTreeStatus.FAILURE
        elif status == BehaviorTreeStatus.FAILURE:
            return BehaviorTreeStatus.SUCCESS
        return status # RUNNING

class Action(Node):
    """A leaf node that performs an action."""
    def tick(self, context: Context) -> BehaviorTreeStatus:
        # To be implemented by subclasses
        return BehaviorTreeStatus.SUCCESS

class SelectGeneratorAction(Action):
    """Sets the generator type on the blackboard."""
    def __init__(self, generator_name: str):
        self.generator_name = generator_name

    def tick(self, context: Context) -> BehaviorTreeStatus:
        context.blackboard.set('selected_generator', self.generator_name)
        return BehaviorTreeStatus.SUCCESS

class Condition(Node):
    """A leaf node that checks a condition."""
    def tick(self, context: Context) -> BehaviorTreeStatus:
        # To be implemented by subclasses
        return BehaviorTreeStatus.FAILURE

class IsEnergyAbove(Condition):
    """Checks if the average energy of a segment is above a threshold."""
    def __init__(self, threshold: float):
        self.threshold = threshold

    def tick(self, context: Context) -> BehaviorTreeStatus:
        # This is a simplified example. A real implementation would analyze
        # the energy of the specific segment.
        avg_energy = context.audio_features.get('energy', 0)
        if avg_energy > self.threshold:
            return BehaviorTreeStatus.SUCCESS
        return BehaviorTreeStatus.FAILURE

class IsTempoInRange(Condition):
    """Checks if the average tempo is within a given range."""
    def __init__(self, min_tempo: float, max_tempo: float):
        self.min_tempo = min_tempo
        self.max_tempo = max_tempo

    def tick(self, context: Context) -> BehaviorTreeStatus:
        avg_bpm = context.audio_features.get('bpm', 120)
        if self.min_tempo <= avg_bpm <= self.max_tempo:
            return BehaviorTreeStatus.SUCCESS
        return BehaviorTreeStatus.FAILURE