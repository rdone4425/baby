import { buildOutingChecklist, deriveTodayItems, deriveWeeklyPlan } from "../../features/dashboard/deriveDashboard";
import {
  Appointment,
  BabyProfile,
  DashboardData,
  FamilyTask,
  Reminder
} from "../../types/domain";
import { ServiceResult } from "../../types/service";
import { createId } from "../../utils/id";
import { readMockDatabase, writeMockDatabase } from "../../storage/mockStore";
import { AppRepository, OutingContext } from "./types";
import {
  mapAppointmentInput,
  mapBabyProfileInput,
  mapFamilyTaskInput,
  mapReminderInput
} from "./mappers";
import { applyFeedbackToMemory, normalizeAgentMemory } from "../../agent/memory";
import { runAgentKernel } from "../../agent/runKernel";
import { AgentFeedback } from "../../types/agent";

function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

export function createMockRepository(): AppRepository {
  return {
    mode: "mock",
    async getCurrentUser() {
      const db = await readMockDatabase();
      return ok(db.user);
    },
    async requestMagicLink() {
      return { ok: false, error: "Magic link is unavailable in mock mode." };
    },
    async getDashboardData() {
      const db = await readMockDatabase();
      const dashboard: DashboardData = {
        user: db.user,
        mode: "mock",
        babyProfile: db.babyProfile,
        appointments: db.appointments,
        reminders: db.reminders,
        familyTasks: db.familyTasks,
        todayItems: deriveTodayItems("en", db.babyProfile, db.appointments, db.familyTasks)
      };
      return ok(dashboard);
    },
    async getAgentState() {
      const db = await readMockDatabase();
      return ok({
        memory: normalizeAgentMemory(db.agentMemory),
        latestRun: db.agentRuns[0] ?? null
      });
    },
    async getAgentHistory() {
      const db = await readMockDatabase();
      return ok(db.agentRuns);
    },
    async runAgent(input) {
      const db = await readMockDatabase();
      const memory = normalizeAgentMemory(db.agentMemory);
      const run = runAgentKernel(input, memory);
      await writeMockDatabase({
        ...db,
        agentMemory: memory,
        agentRuns: [run, ...db.agentRuns].slice(0, 20)
      });
      return ok(run);
    },
    async saveAgentFeedback(input: AgentFeedback) {
      const db = await readMockDatabase();
      const nextMemory = applyFeedbackToMemory(normalizeAgentMemory(db.agentMemory), input);
      await writeMockDatabase({
        ...db,
        agentMemory: nextMemory,
        agentFeedback: [input, ...db.agentFeedback].slice(0, 50)
      });
      return ok(undefined);
    },
    async getWeeklyPlan() {
      const db = await readMockDatabase();
      return ok(deriveWeeklyPlan("en", db.appointments, db.reminders, db.familyTasks));
    },
    async getOutingChecklist(context: OutingContext) {
      return ok(buildOutingChecklist(context.locale, context.scenario, context.babyProfile));
    },
    async getFamilyTasks() {
      const db = await readMockDatabase();
      return ok(db.familyTasks);
    },
    async saveBabyProfile(input) {
      const db = await readMockDatabase();
      if (!input.name.trim() || !input.birthDate.trim()) {
        return { ok: false, error: "Baby name and birth date are required." };
      }
      const profile: BabyProfile = {
        id: db.babyProfile?.id ?? createId("baby"),
        userId: db.user.id,
        ...mapBabyProfileInput(input)
      };
      await writeMockDatabase({ ...db, babyProfile: profile });
      return ok(profile);
    },
    async saveAppointment(input) {
      const db = await readMockDatabase();
      if (!db.babyProfile) {
        return { ok: false, error: "Create a baby profile first." };
      }
      if (!input.title.trim() || !input.startsAt.trim()) {
        return { ok: false, error: "Appointment title and start time are required." };
      }
      const appointment: Appointment = {
        id: createId("appointment"),
        userId: db.user.id,
        babyId: db.babyProfile.id,
        ...mapAppointmentInput(input)
      };
      await writeMockDatabase({ ...db, appointments: [appointment, ...db.appointments] });
      return ok(appointment);
    },
    async saveReminder(input) {
      const db = await readMockDatabase();
      if (!db.babyProfile) {
        return { ok: false, error: "Create a baby profile first." };
      }
      if (!input.title.trim() || !input.dueAt.trim()) {
        return { ok: false, error: "Reminder title and due time are required." };
      }
      const reminder: Reminder = {
        id: createId("reminder"),
        userId: db.user.id,
        babyId: db.babyProfile.id,
        status: "todo",
        source: "manual",
        ...mapReminderInput(input)
      };
      await writeMockDatabase({ ...db, reminders: [reminder, ...db.reminders] });
      return ok(reminder);
    },
    async saveFamilyTask(input) {
      const db = await readMockDatabase();
      if (!db.babyProfile) {
        return { ok: false, error: "Create a baby profile first." };
      }
      if (!input.assigneeName.trim() || !input.title.trim() || !input.dueAt.trim()) {
        return { ok: false, error: "Assignee, task, and due time are required." };
      }
      const task: FamilyTask = {
        id: createId("family-task"),
        userId: db.user.id,
        babyId: db.babyProfile.id,
        status: "todo",
        ...mapFamilyTaskInput(input)
      };
      await writeMockDatabase({ ...db, familyTasks: [task, ...db.familyTasks] });
      return ok(task);
    }
  };
}
