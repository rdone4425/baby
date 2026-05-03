import { AgentMemory, AgentObservation, AgentRun } from "../types/agent";
import { createId } from "../utils/id";
import { AGENT_STRATEGY_VERSION } from "./memory";
import { runRuleBasedStrategy } from "./strategyEngine";

export function runAgentKernel(observation: AgentObservation, memory: AgentMemory): AgentRun {
  return {
    id: createId("agent-run"),
    createdAt: new Date().toISOString(),
    trigger: observation.trigger,
    strategyVersion: AGENT_STRATEGY_VERSION,
    snapshot: {
      hasBabyProfile: Boolean(observation.babyProfile),
      appointmentCount: observation.appointments.length,
      reminderCount: observation.reminders.length,
      familyTaskCount: observation.familyTasks.length,
      outingScenario: observation.outingScenario
    },
    recommendations: runRuleBasedStrategy(observation, memory)
  };
}
