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
import { isValidIsoDate } from "../../utils/date";
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
import { AgentFeedback, AgentRun, UserMemoryEvent, UserMemorySnapshot } from "../../types/agent";
import { getLatestRunFromUserMemory, loadSoul, loadUserMemory, saveUserMemory } from "../../storage/agentDocuments";

function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

function buildSummaryNotes(db: Awaited<ReturnType<typeof readMockDatabase>>, latestRun: AgentRun | null) {
  const notes = [
    db.babyProfile
      ? `${db.babyProfile.name} in ${[db.babyProfile.country, db.babyProfile.region, db.babyProfile.street].filter(Boolean).join(", ")} has ${db.appointments.length} appointments, ${db.reminders.length} reminders, and ${db.familyTasks.length} family tasks tracked locally.`
      : db.user.country || db.user.region || db.user.street
        ? `User context is set to ${[db.user.country, db.user.region, db.user.street].filter(Boolean).join(", ")}.`
      : "No baby profile has been created yet.",
    latestRun
      ? `Latest agent run generated ${latestRun.recommendations.length} recommendations on ${latestRun.createdAt}.`
      : "No agent run has been recorded yet."
  ];

  if (db.babyProfile?.notes) {
    notes.push(`Profile note: ${db.babyProfile.notes}`);
  }

  return notes;
}

function createSnapshot(
  db: Awaited<ReturnType<typeof readMockDatabase>>,
  memory: UserMemorySnapshot["memory"],
  latestRun: AgentRun | null
): UserMemorySnapshot {
  return {
    schemaVersion: "1.0.0",
      userId: db.user.id,
      userName: db.user.name,
      userEmail: db.user.email,
      preferredLocale: null,
      country: db.babyProfile?.country ?? db.user.country ?? null,
      region: db.babyProfile?.region ?? db.user.region ?? null,
      street: db.babyProfile?.street ?? db.user.street ?? null,
      babyName: db.babyProfile?.name ?? null,
    babyBirthDate: db.babyProfile?.birthDate ?? null,
    feedingMode: db.babyProfile?.feedingMode ?? null,
    profileNotes: db.babyProfile?.notes ?? null,
    activeTaskCount: db.familyTasks.filter((task) => task.status !== "done").length,
    reminderCount: db.reminders.length,
    appointmentCount: db.appointments.length,
    summaryNotes: buildSummaryNotes(db, latestRun),
    memory: normalizeAgentMemory(memory),
    latestRun
  };
}

function createEvent(
  event: UserMemoryEvent["type"],
  createdAt: string,
  title: string,
  summary: string,
  payload?: Record<string, unknown>
): UserMemoryEvent {
  return {
    id: createId("memory-event"),
    type: event,
    createdAt,
    title,
    summary,
    payload
  };
}

function createLegacyEvents(db: Awaited<ReturnType<typeof readMockDatabase>>): UserMemoryEvent[] {
  const runEvents = db.agentRuns.map((run) =>
    createEvent("agent_run", run.createdAt, "Legacy agent run migrated", `Recovered ${run.recommendations.length} recommendations.`, {
      run
    })
  );
  const feedbackEvents = db.agentFeedback.map((feedback) =>
    createEvent("feedback", feedback.appliedAt, "Legacy feedback migrated", `Recovered ${feedback.verdict} feedback for ${feedback.recommendationKind}.`, {
      feedback
    })
  );

  return [...runEvents, ...feedbackEvents].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

async function syncUserMemoryFromDatabase(db: Awaited<ReturnType<typeof readMockDatabase>>) {
  await loadSoul();
  const document = await loadUserMemory();
  const hasStructuredMemory = document.snapshot.userId !== "unknown" || document.events.length > 0;
  const memory = hasStructuredMemory ? document.snapshot.memory : normalizeAgentMemory(db.agentMemory);
  const latestRun = hasStructuredMemory ? getLatestRunFromUserMemory(document) : db.agentRuns[0] ?? null;
  const events = document.events.length ? document.events : createLegacyEvents(db);
  return saveUserMemory(createSnapshot(db, memory, latestRun), events);
}

async function appendDomainEvent(
  type: UserMemoryEvent["type"],
  title: string,
  summary: string,
  payload: Record<string, unknown> | undefined,
  db: Awaited<ReturnType<typeof readMockDatabase>>
) {
  const current = await syncUserMemoryFromDatabase(db);
  return saveUserMemory(current.snapshot, [createEvent(type, new Date().toISOString(), title, summary, payload), ...current.events].slice(0, 60));
}

export function createMockRepository(): AppRepository {
  return {
    mode: "mock",
    async getCurrentUser() {
      const db = await readMockDatabase();
      return ok(db.user);
    },
    async saveUserLocation(input) {
      const db = await readMockDatabase();
      const nextDb = {
        ...db,
        user: {
          ...db.user,
          country: input.country.trim(),
          region: input.region.trim(),
          street: input.street.trim()
        }
      };
      await writeMockDatabase(nextDb);
      await syncUserMemoryFromDatabase(nextDb);
      return ok(nextDb.user);
    },
    async requestMagicLink() {
      return { ok: false, error: "Magic link is unavailable in mock mode." };
    },
    async getDashboardData() {
      const db = await readMockDatabase();
      await syncUserMemoryFromDatabase(db);
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
      const document = await syncUserMemoryFromDatabase(db);
      return ok({
        memory: document.snapshot.memory,
        latestRun: getLatestRunFromUserMemory(document)
      });
    },
    async getAgentHistory() {
      const db = await readMockDatabase();
      const document = await syncUserMemoryFromDatabase(db);
      const runs = document.events
        .filter((event) => event.type === "agent_run" && event.payload?.run)
        .map((event) => event.payload?.run as AgentRun);
      return ok(runs);
    },
    async runAgent(input) {
      const db = await readMockDatabase();
      const document = await syncUserMemoryFromDatabase(db);
      const memory = normalizeAgentMemory(document.snapshot.memory);
      const run = runAgentKernel(input, memory);
      await saveUserMemory(
        createSnapshot(db, memory, run),
        [
          createEvent(
            "agent_run",
            run.createdAt,
            "Agent run completed",
            `Generated ${run.recommendations.length} recommendations for ${run.trigger}.`,
            { run }
          ),
          ...document.events
        ].slice(0, 60)
      );
      return ok(run);
    },
    async saveAgentFeedback(input: AgentFeedback) {
      const db = await readMockDatabase();
      const document = await syncUserMemoryFromDatabase(db);
      const nextMemory = applyFeedbackToMemory(normalizeAgentMemory(document.snapshot.memory), input);
      await saveUserMemory(
        createSnapshot(db, nextMemory, getLatestRunFromUserMemory(document)),
        [
          createEvent(
            "feedback",
            input.appliedAt,
            "Recommendation feedback recorded",
            `${input.verdict} feedback received for ${input.recommendationKind}.`,
            { feedback: input }
          ),
          ...document.events
        ].slice(0, 60)
      );
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
      const hasValidBirthDate = isValidIsoDate(input.birthDate.trim());
      if (!input.country.trim() || !input.region.trim() || !input.street.trim() || !input.name.trim() || !hasValidBirthDate) {
        return { ok: false, error: "Country, region, street, baby name, and a full birth date are required." };
      }
      const profile: BabyProfile = {
        id: db.babyProfile?.id ?? createId("baby"),
        userId: db.user.id,
        ...mapBabyProfileInput(input)
      };
      const nextDb = { ...db, babyProfile: profile };
      await writeMockDatabase(nextDb);
      await appendDomainEvent("profile_update", "Baby profile updated", `Saved profile for ${profile.name}.`, { profile }, nextDb);
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
      const nextDb = { ...db, appointments: [appointment, ...db.appointments] };
      await writeMockDatabase(nextDb);
      await appendDomainEvent("appointment", "Appointment added", `Added appointment "${appointment.title}".`, { appointment }, nextDb);
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
      const nextDb = { ...db, reminders: [reminder, ...db.reminders] };
      await writeMockDatabase(nextDb);
      await appendDomainEvent("reminder", "Reminder added", `Added reminder "${reminder.title}".`, { reminder }, nextDb);
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
      const nextDb = { ...db, familyTasks: [task, ...db.familyTasks] };
      await writeMockDatabase(nextDb);
      await appendDomainEvent("family_task", "Family task added", `Assigned "${task.title}" to ${task.assigneeName}.`, { task }, nextDb);
      return ok(task);
    }
  };
}
