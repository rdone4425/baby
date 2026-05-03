import {
  AgentFeedback,
  AgentMemory,
  AgentRecommendationKind,
  KindStats,
  PreferenceProfile
} from "../types/agent";
import { OutingScenario } from "../types/domain";

export const AGENT_STRATEGY_VERSION = "rule-v1";

const recommendationKinds: AgentRecommendationKind[] = [
  "onboarding",
  "appointment_focus",
  "task_focus",
  "stage_guidance",
  "reminder_focus",
  "outing_prep",
  "family_handoff"
];

function createKindStats(): KindStats {
  return {
    accepted: 0,
    ignored: 0,
    notRelevant: 0,
    implicitAccepted: 0
  };
}

function createPreferredScenarios(): Record<OutingScenario, number> {
  return {
    clinic: 0,
    park: 0,
    grocery: 0,
    familyVisit: 0
  };
}

export function createEmptyPreferenceProfile(): PreferenceProfile {
  return {
    preferredAssignees: {},
    preferredOutingScenarios: createPreferredScenarios(),
    reminderTimeBias: {
      morning: 0,
      afternoon: 0,
      evening: 0
    }
  };
}

export function createEmptyAgentMemory(): AgentMemory {
  return {
    strategyVersion: AGENT_STRATEGY_VERSION,
    kindWeights: {
      onboarding: 0,
      appointment_focus: 0,
      task_focus: 0,
      stage_guidance: 0,
      reminder_focus: 0,
      outing_prep: 0,
      family_handoff: 0
    },
    statsByKind: {
      onboarding: createKindStats(),
      appointment_focus: createKindStats(),
      task_focus: createKindStats(),
      stage_guidance: createKindStats(),
      reminder_focus: createKindStats(),
      outing_prep: createKindStats(),
      family_handoff: createKindStats()
    },
    preferenceProfile: createEmptyPreferenceProfile(),
    lastUpdatedAt: null
  };
}

function adjustWeight(current: number, delta: number) {
  return Math.max(-3, Math.min(3, Number((current + delta).toFixed(2))));
}

function getDayPart(dateString: string) {
  const hour = new Date(dateString).getHours();
  if (hour < 12) {
    return "morning" as const;
  }
  if (hour < 18) {
    return "afternoon" as const;
  }
  return "evening" as const;
}

export function applyFeedbackToMemory(memory: AgentMemory, feedback: AgentFeedback) {
  const next: AgentMemory = JSON.parse(JSON.stringify(memory));
  const stats = next.statsByKind[feedback.recommendationKind];

  if (feedback.verdict === "accepted") {
    stats.accepted += 1;
    next.kindWeights[feedback.recommendationKind] = adjustWeight(next.kindWeights[feedback.recommendationKind], 0.4);
  }

  if (feedback.verdict === "ignored") {
    stats.ignored += 1;
    next.kindWeights[feedback.recommendationKind] = adjustWeight(next.kindWeights[feedback.recommendationKind], -0.3);
  }

  if (feedback.verdict === "not_relevant") {
    stats.notRelevant += 1;
    next.kindWeights[feedback.recommendationKind] = adjustWeight(next.kindWeights[feedback.recommendationKind], -0.15);
  }

  if (feedback.verdict === "implicit_accept") {
    stats.implicitAccepted += 1;
    next.kindWeights[feedback.recommendationKind] = adjustWeight(next.kindWeights[feedback.recommendationKind], 0.2);
  }

  if (feedback.outingScenario && (feedback.verdict === "accepted" || feedback.verdict === "implicit_accept")) {
    next.preferenceProfile.preferredOutingScenarios[feedback.outingScenario] += 1;
  }

  if (feedback.assigneeName && (feedback.verdict === "accepted" || feedback.verdict === "implicit_accept")) {
    const current = next.preferenceProfile.preferredAssignees[feedback.assigneeName] ?? 0;
    next.preferenceProfile.preferredAssignees[feedback.assigneeName] = current + 1;
  }

  if (feedback.recommendationKind === "reminder_focus") {
    const dayPart = getDayPart(feedback.appliedAt);
    const delta = feedback.verdict === "ignored" ? -1 : 1;
    next.preferenceProfile.reminderTimeBias[dayPart] += delta;
  }

  next.lastUpdatedAt = feedback.appliedAt;
  return next;
}

export function getKindWeight(memory: AgentMemory, kind: AgentRecommendationKind) {
  return memory.kindWeights[kind] ?? 0;
}

export function getPreferredAssigneeBoost(memory: AgentMemory, assigneeName: string) {
  return memory.preferenceProfile.preferredAssignees[assigneeName] ?? 0;
}

export function getPreferredScenarioBoost(memory: AgentMemory, scenario: OutingScenario) {
  return memory.preferenceProfile.preferredOutingScenarios[scenario] ?? 0;
}

export function normalizeAgentMemory(input?: AgentMemory | null) {
  if (!input) {
    return createEmptyAgentMemory();
  }

  const base = createEmptyAgentMemory();
  return {
    ...base,
    ...input,
    kindWeights: {
      ...base.kindWeights,
      ...input.kindWeights
    },
    statsByKind: recommendationKinds.reduce(
      (acc, kind) => ({
        ...acc,
        [kind]: {
          ...base.statsByKind[kind],
          ...(input.statsByKind?.[kind] ?? {})
        }
      }),
      {} as AgentMemory["statsByKind"]
    ),
    preferenceProfile: {
      ...base.preferenceProfile,
      ...(input.preferenceProfile ?? {}),
      preferredAssignees: {
        ...base.preferenceProfile.preferredAssignees,
        ...(input.preferenceProfile?.preferredAssignees ?? {})
      },
      preferredOutingScenarios: {
        ...base.preferenceProfile.preferredOutingScenarios,
        ...(input.preferenceProfile?.preferredOutingScenarios ?? {})
      },
      reminderTimeBias: {
        ...base.preferenceProfile.reminderTimeBias,
        ...(input.preferenceProfile?.reminderTimeBias ?? {})
      }
    }
  };
}
