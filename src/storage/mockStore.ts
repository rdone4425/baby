import AsyncStorage from "@react-native-async-storage/async-storage";
import { createEmptyAgentMemory } from "../agent/memory";
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

export async function readMockDatabase() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      user: {
        id: "demo-user",
        email: "demo@babyweekly.app",
        name: "Demo Parent"
      },
      babyProfile: null,
      appointments: [],
      reminders: [],
      familyTasks: [],
      agentMemory: createEmptyAgentMemory(),
      agentRuns: [],
      agentFeedback: []
    } satisfies MockDatabase;
  }

  return JSON.parse(raw) as MockDatabase;
}

export async function writeMockDatabase(value: MockDatabase) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}
