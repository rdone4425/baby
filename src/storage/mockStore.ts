import AsyncStorage from "@react-native-async-storage/async-storage";
import { createEmptyAgentMemory } from "../agent/memory";
import { createId } from "../utils/id";
import { AgentFeedback, AgentMemory, AgentRun } from "../types/agent";
import { Appointment, BabyProfile, FamilyTask, Reminder, User } from "../types/domain";

export type MockDatabase = {
  user: User;
  babyProfile: BabyProfile | null;
  appointments: Appointment[];
  reminders: Reminder[];
  familyTasks: FamilyTask[];
  agentMemory: AgentMemory;
  agentRuns: AgentRun[];
  agentFeedback: AgentFeedback[];
};

const STORAGE_KEY = "baby-agent-mobile/mock-db";

function createDefaultMockDatabase(): MockDatabase {
  return {
    user: {
      id: createId("user"),
      email: "",
      name: "Local Parent",
      country: "",
      region: "",
      street: ""
    },
    babyProfile: null,
    appointments: [],
    reminders: [],
    familyTasks: [],
    agentMemory: createEmptyAgentMemory(),
    agentRuns: [],
    agentFeedback: []
  };
}

export async function readMockDatabase() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fresh = createDefaultMockDatabase();
    await writeMockDatabase(fresh);
    return fresh;
  }

  const parsed = JSON.parse(raw) as MockDatabase;
  parsed.user = {
    ...parsed.user,
    id: parsed.user?.id || createId("user"),
    email: parsed.user?.email ?? "",
    name: parsed.user?.name ?? "Local Parent",
    country: parsed.user?.country ?? "",
    region: parsed.user?.region ?? "",
    street: parsed.user?.street ?? ""
  };
  if (parsed.babyProfile) {
    parsed.babyProfile = {
      ...parsed.babyProfile,
      country: parsed.babyProfile.country ?? "",
      region: parsed.babyProfile.region ?? "",
      street: parsed.babyProfile.street ?? ""
    };
  }

  return parsed;
}

export async function writeMockDatabase(value: MockDatabase) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}
