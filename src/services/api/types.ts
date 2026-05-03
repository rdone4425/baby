import {
  Appointment,
  BabyProfile,
  DashboardData,
  FamilyTask,
  Locale,
  OutingChecklistItem,
  OutingScenario,
  Reminder,
  User,
  WeeklyPlanItem
} from "../../types/domain";
import { AgentFeedback, AgentMemory, AgentObservation, AgentRun } from "../../types/agent";
import { ServiceResult } from "../../types/service";

export type OutingContext = {
  scenario: OutingScenario;
  babyProfile: BabyProfile | null;
  locale: Locale;
};

export type AppRepository = {
  mode: "mock" | "supabase";
  getCurrentUser(): Promise<ServiceResult<User>>;
  saveUserLocation(input: Pick<User, "country" | "region" | "street">): Promise<ServiceResult<User>>;
  requestMagicLink(email: string): Promise<ServiceResult<void>>;
  getDashboardData(): Promise<ServiceResult<DashboardData>>;
  getAgentState(): Promise<ServiceResult<{ memory: AgentMemory; latestRun: AgentRun | null }>>;
  getAgentHistory(): Promise<ServiceResult<AgentRun[]>>;
  runAgent(input: AgentObservation): Promise<ServiceResult<AgentRun>>;
  saveAgentFeedback(input: AgentFeedback): Promise<ServiceResult<void>>;
  getWeeklyPlan(): Promise<ServiceResult<WeeklyPlanItem[]>>;
  getOutingChecklist(context: OutingContext): Promise<ServiceResult<OutingChecklistItem[]>>;
  getFamilyTasks(): Promise<ServiceResult<FamilyTask[]>>;
  saveBabyProfile(input: Omit<BabyProfile, "id" | "userId">): Promise<ServiceResult<BabyProfile>>;
  saveAppointment(input: Omit<Appointment, "id" | "userId" | "babyId">): Promise<ServiceResult<Appointment>>;
  saveReminder(input: Omit<Reminder, "id" | "userId" | "babyId" | "status" | "source">): Promise<ServiceResult<Reminder>>;
  saveFamilyTask(input: Omit<FamilyTask, "id" | "userId" | "babyId" | "status">): Promise<ServiceResult<FamilyTask>>;
};
