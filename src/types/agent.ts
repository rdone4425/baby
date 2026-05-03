import { Appointment, BabyProfile, FamilyTask, Locale, OutingScenario, Reminder } from "./domain";

export type AgentTrigger =
  | "app_load"
  | "manual_refresh"
  | "profile_saved"
  | "appointment_saved"
  | "reminder_saved"
  | "family_task_saved"
  | "outing_scenario_changed";

export type AgentSurface = "today" | "planner" | "outings" | "family";

export type AgentRecommendationKind =
  | "onboarding"
  | "appointment_focus"
  | "task_focus"
  | "stage_guidance"
  | "reminder_focus"
  | "outing_prep"
  | "family_handoff";

export type AgentPriority = "high" | "medium" | "low";

export type AgentFeedbackVerdict = "accepted" | "ignored" | "not_relevant" | "implicit_accept";

export type AgentFeedbackChannel = "explicit" | "implicit";

export type AgentObservation = {
  userId: string;
  locale: Locale;
  trigger: AgentTrigger;
  occurredAt: string;
  outingScenario: OutingScenario;
  babyProfile: BabyProfile | null;
  appointments: Appointment[];
  reminders: Reminder[];
  familyTasks: FamilyTask[];
};

export type AgentRecommendation = {
  id: string;
  surface: AgentSurface;
  kind: AgentRecommendationKind;
  title: string;
  description: string;
  reason: string;
  priority: AgentPriority;
  confidence: number;
  sourceSignals: string[];
  relatedEntityId?: string;
  metadata?: Record<string, string>;
};

export type AgentFeedback = {
  id: string;
  recommendationId: string;
  recommendationKind: AgentRecommendationKind;
  verdict: AgentFeedbackVerdict;
  channel: AgentFeedbackChannel;
  appliedAt: string;
  note?: string;
  outingScenario?: OutingScenario;
  assigneeName?: string;
};

export type KindStats = {
  accepted: number;
  ignored: number;
  notRelevant: number;
  implicitAccepted: number;
};

export type PreferenceProfile = {
  preferredAssignees: Record<string, number>;
  preferredOutingScenarios: Record<OutingScenario, number>;
  reminderTimeBias: {
    morning: number;
    afternoon: number;
    evening: number;
  };
};

export type AgentMemory = {
  strategyVersion: string;
  kindWeights: Record<AgentRecommendationKind, number>;
  statsByKind: Record<AgentRecommendationKind, KindStats>;
  preferenceProfile: PreferenceProfile;
  lastUpdatedAt: string | null;
};

export type AgentRun = {
  id: string;
  createdAt: string;
  trigger: AgentTrigger;
  strategyVersion: string;
  snapshot: {
    hasBabyProfile: boolean;
    appointmentCount: number;
    reminderCount: number;
    familyTaskCount: number;
    outingScenario: OutingScenario;
  };
  recommendations: AgentRecommendation[];
};

export type SoulDocumentMeta = {
  version: string;
  role: string;
  mission: string;
  tone: string;
};

export type SoulDocument = {
  meta: SoulDocumentMeta;
  rawMarkdown: string;
};

export type UserMemoryEventType = "agent_run" | "feedback" | "profile_update" | "appointment" | "reminder" | "family_task";

export type UserMemoryEvent = {
  id: string;
  type: UserMemoryEventType;
  createdAt: string;
  title: string;
  summary: string;
  payload?: Record<string, unknown>;
};

export type UserMemorySnapshot = {
  schemaVersion: string;
  userId: string;
  userName: string;
  userEmail: string;
  preferredLocale: string | null;
  country: string | null;
  region: string | null;
  street: string | null;
  babyName: string | null;
  babyBirthDate: string | null;
  feedingMode: string | null;
  profileNotes: string | null;
  activeTaskCount: number;
  reminderCount: number;
  appointmentCount: number;
  summaryNotes: string[];
  memory: AgentMemory;
  latestRun: AgentRun | null;
};

export type UserMemoryDocument = {
  snapshot: UserMemorySnapshot;
  events: UserMemoryEvent[];
  rawMarkdown: string;
};
