import {
  buildOutingChecklist,
  deriveNextAction,
  deriveTodayItems,
  deriveWeeklyPlan
} from "../deriveDashboard";
import type {
  Appointment,
  BabyProfile,
  FamilyTask,
  Reminder
} from "../../../types/domain";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function makeBaby(overrides: Partial<BabyProfile> = {}): BabyProfile {
  return {
    id: "baby-1",
    userId: "user-1",
    country: "JP",
    region: "Tokyo",
    street: "1-2-3",
    name: "Mochi",
    birthDate: todayIso(),
    feedingMode: "mixed",
    notes: "",
    ...overrides
  };
}

function makeAppointment(overrides: Partial<Appointment> = {}): Appointment {
  return {
    id: "appt-1",
    userId: "user-1",
    babyId: "baby-1",
    title: "Pediatric checkup",
    startsAt: "2026-05-10T09:00:00.000Z",
    location: "Clinic A",
    notes: "",
    category: "checkup",
    ...overrides
  };
}

function makeFamilyTask(overrides: Partial<FamilyTask> = {}): FamilyTask {
  return {
    id: "task-1",
    userId: "user-1",
    babyId: "baby-1",
    assigneeName: "Grandma",
    title: "Pickup at 3pm",
    status: "todo",
    dueAt: "2026-05-04T15:00:00.000Z",
    ...overrides
  };
}

function makeReminder(overrides: Partial<Reminder> = {}): Reminder {
  return {
    id: "reminder-1",
    userId: "user-1",
    babyId: "baby-1",
    title: "Order vitamin D",
    dueAt: "2026-05-05T09:00:00.000Z",
    status: "todo",
    source: "manual",
    ...overrides
  };
}

describe("deriveTodayItems", () => {
  it("returns an empty list when nothing is provided", () => {
    expect(deriveTodayItems("en", null, [], [])).toEqual([]);
  });

  it("emits a high-priority appointment item using the earliest startsAt", () => {
    const earlier = makeAppointment({
      id: "appt-early",
      title: "Earlier appt",
      startsAt: "2026-05-01T09:00:00.000Z"
    });
    const later = makeAppointment({
      id: "appt-late",
      title: "Later appt",
      startsAt: "2026-06-01T09:00:00.000Z"
    });

    const items = deriveTodayItems("en", null, [later, earlier], []);
    const appointment = items.find((item) => item.type === "appointment");

    expect(appointment).toBeDefined();
    expect(appointment?.priority).toBe("high");
    expect(appointment?.title).toBe("Earlier appt");
    expect(appointment?.relatedEntityId).toBe("appt-early");
  });

  it("falls back to a placeholder location string when location is empty", () => {
    const appointment = makeAppointment({ location: "" });

    const enItems = deriveTodayItems("en", null, [appointment], []);
    const zhItems = deriveTodayItems("zh", null, [appointment], []);

    expect(enItems[0].description).toContain("To be added");
    expect(zhItems[0].description).toContain("待补充");
  });

  it("emits a medium-priority family task using the earliest dueAt", () => {
    const earlier = makeFamilyTask({
      id: "task-early",
      title: "Earlier task",
      dueAt: "2026-05-04T08:00:00.000Z"
    });
    const later = makeFamilyTask({
      id: "task-late",
      title: "Later task",
      dueAt: "2026-05-09T08:00:00.000Z"
    });

    const items = deriveTodayItems("en", null, [], [later, earlier]);
    const task = items.find((item) => item.type === "task");

    expect(task).toBeDefined();
    expect(task?.priority).toBe("medium");
    expect(task?.title).toBe("Earlier task");
    expect(task?.description).toContain("Grandma");
  });

  it("appends a low-priority stage item when a baby profile is present", () => {
    const items = deriveTodayItems("en", makeBaby(), [], []);
    const stage = items.find((item) => item.type === "stage");

    expect(stage).toBeDefined();
    expect(stage?.priority).toBe("low");
    expect(stage?.relatedEntityId).toBe("baby-1");
  });

  it("does not mutate input arrays", () => {
    const appointments = [
      makeAppointment({ id: "a2", startsAt: "2026-06-01T09:00:00.000Z" }),
      makeAppointment({ id: "a1", startsAt: "2026-05-01T09:00:00.000Z" })
    ];
    const snapshot = appointments.map((item) => item.id);

    deriveTodayItems("en", null, appointments, []);

    expect(appointments.map((item) => item.id)).toEqual(snapshot);
  });
});

describe("deriveWeeklyPlan", () => {
  it("returns an empty list when all sources are empty", () => {
    expect(deriveWeeklyPlan("en", [], [], [])).toEqual([]);
  });

  it("merges appointments, reminders, and tasks while tagging the source type", () => {
    const items = deriveWeeklyPlan(
      "en",
      [makeAppointment()],
      [makeReminder()],
      [makeFamilyTask()]
    );

    const types = items.map((item) => item.type).sort();
    expect(types).toEqual(["appointment", "reminder", "task"]);
  });

  it("uses location for appointment detail and falls back to notes then placeholder", () => {
    const withLocation = makeAppointment({ id: "a-loc", location: "Clinic A", notes: "" });
    const withNotes = makeAppointment({ id: "a-notes", location: "", notes: "Bring booklet" });
    const empty = makeAppointment({ id: "a-empty", location: "", notes: "" });

    const items = deriveWeeklyPlan("en", [withLocation, withNotes, empty], [], []);
    const byId = new Map(items.map((item) => [item.id, item]));

    expect(byId.get("a-loc")?.detail).toBe("Clinic A");
    expect(byId.get("a-notes")?.detail).toBe("Bring booklet");
    expect(byId.get("a-empty")?.detail).toBe("Add detail");
  });

  it("includes the assignee name in the family task detail", () => {
    const items = deriveWeeklyPlan(
      "en",
      [],
      [],
      [makeFamilyTask({ assigneeName: "Dad" })]
    );

    expect(items[0].detail).toContain("Dad");
  });

  it("orders items chronologically by underlying timestamp, not weekday string", () => {
    // Pick three days that span a week so the bug surfaces:
    // weekday string sort would put "Fri" < "Mon" < "Wed" (lexicographic)
    // but the real chronological order is Mon -> Wed -> Fri.
    const monday = makeReminder({
      id: "reminder-mon",
      title: "Monday reminder",
      dueAt: "2026-05-04T09:00:00.000Z"
    });
    const wednesday = makeAppointment({
      id: "appt-wed",
      title: "Wednesday appointment",
      startsAt: "2026-05-06T09:00:00.000Z"
    });
    const friday = makeFamilyTask({
      id: "task-fri",
      title: "Friday task",
      dueAt: "2026-05-08T09:00:00.000Z"
    });

    const items = deriveWeeklyPlan("en", [wednesday], [monday], [friday]);

    expect(items.map((item) => item.id)).toEqual([
      "reminder-mon",
      "appt-wed",
      "task-fri"
    ]);
  });

  it("keeps chronological order when items share a weekday across different weeks", () => {
    // Two Mondays in different weeks. Sorting by weekday string would tie
    // them and leave insertion order, masking the real chronological order.
    const earlyMon = makeAppointment({
      id: "appt-may4",
      title: "Earlier Monday",
      startsAt: "2026-05-04T09:00:00.000Z"
    });
    const laterMon = makeAppointment({
      id: "appt-may11",
      title: "Later Monday",
      startsAt: "2026-05-11T09:00:00.000Z"
    });

    const items = deriveWeeklyPlan("en", [laterMon, earlyMon], [], []);

    expect(items.map((item) => item.id)).toEqual(["appt-may4", "appt-may11"]);
  });
});

describe("deriveNextAction", () => {
  it("returns onboarding copy when there are no reminders", () => {
    expect(deriveNextAction("en", [])).toMatch(/Add one important reminder/);
    expect(deriveNextAction("zh", [])).toMatch(/最关键的提醒/);
  });

  it("references the earliest reminder by dueAt", () => {
    const earlier = makeReminder({
      id: "r-early",
      title: "Order vitamin D",
      dueAt: "2026-05-01T08:00:00.000Z"
    });
    const later = makeReminder({
      id: "r-late",
      title: "Book hair trim",
      dueAt: "2026-06-01T08:00:00.000Z"
    });

    expect(deriveNextAction("en", [later, earlier])).toContain("Order vitamin D");
    expect(deriveNextAction("zh", [later, earlier])).toContain("Order vitamin D");
  });
});

describe("buildOutingChecklist", () => {
  it("returns scenario base items plus the under-6-months age item when no baby profile is set", () => {
    const items = buildOutingChecklist("en", "clinic", null);
    const labels = items.map((item) => item.label);

    expect(labels).toEqual([
      "Clinic card or insurance info",
      "Spare outfit",
      "Feeding essentials",
      "Swaddle or light blanket"
    ]);
    expect(items.every((item) => item.packed === false)).toBe(true);
  });

  it("switches to a 6-months-and-up age item when the baby is older", () => {
    const oldBaby = makeBaby({ birthDate: "1900-01-01" });

    const items = buildOutingChecklist("en", "park", oldBaby);
    const labels = items.map((item) => item.label);

    expect(labels).toContain("Starter spoon or bib");
    expect(labels).not.toContain("Swaddle or light blanket");
  });

  it("uses zh copy when the locale is zh", () => {
    const items = buildOutingChecklist("zh", "grocery", null);
    const labels = items.map((item) => item.label);

    expect(labels).toEqual(["快速喂养备用品", "湿巾", "短时外出玩具", "包巾或轻薄盖毯"]);
  });

  it("returns a different base set per scenario", () => {
    const clinic = buildOutingChecklist("en", "clinic", null).map((item) => item.label);
    const park = buildOutingChecklist("en", "park", null).map((item) => item.label);
    const grocery = buildOutingChecklist("en", "grocery", null).map((item) => item.label);
    const familyVisit = buildOutingChecklist("en", "familyVisit", null).map((item) => item.label);

    expect(clinic).not.toEqual(park);
    expect(park).not.toEqual(grocery);
    expect(grocery).not.toEqual(familyVisit);
  });

  it("assigns a unique id to every checklist item", () => {
    const items = buildOutingChecklist("en", "clinic", null);
    const ids = new Set(items.map((item) => item.id));

    expect(ids.size).toBe(items.length);
  });
});
