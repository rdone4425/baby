import { DashboardData, Locale, OutingScenario } from "../types/domain";
import { AgentObservation, AgentTrigger } from "../types/agent";

export function buildAgentObservation(
  dashboard: DashboardData,
  locale: Locale,
  outingScenario: OutingScenario,
  trigger: AgentTrigger
): AgentObservation {
  return {
    userId: dashboard.user.id,
    locale,
    trigger,
    occurredAt: new Date().toISOString(),
    outingScenario,
    babyProfile: dashboard.babyProfile,
    appointments: dashboard.appointments,
    reminders: dashboard.reminders,
    familyTasks: dashboard.familyTasks
  };
}
