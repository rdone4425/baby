export type Locale = "en" | "zh" | "es" | "ja";

export type TabKey = "today" | "planner" | "outings" | "family";

export type BackendMode = "mock" | "supabase";

export type FeedingMode = "breast" | "formula" | "mixed" | "solids";

export type AppointmentCategory = "checkup" | "vaccine" | "outing" | "family";

export type ReminderStatus = "todo" | "done";

export type ReminderSource = "manual" | "system";

export type FamilyTaskStatus = "todo" | "in_progress" | "ready" | "done";

export type TodayItemType = "appointment" | "task" | "stage";

export type TodayPriority = "high" | "medium" | "low";

export type OutingScenario = "clinic" | "park" | "grocery" | "familyVisit";

export type OutingChecklistItem = {
  id: string;
  label: string;
  packed: boolean;
};

export type User = {
  id: string;
  email: string;
  name: string;
  country: string;
  region: string;
  street: string;
};

export type BabyProfile = {
  id: string;
  userId: string;
  country: string;
  region: string;
  street: string;
  name: string;
  birthDate: string;
  feedingMode: FeedingMode;
  notes: string;
};

export type Appointment = {
  id: string;
  userId: string;
  babyId: string;
  title: string;
  startsAt: string;
  location: string;
  notes: string;
  category: AppointmentCategory;
};

export type Reminder = {
  id: string;
  userId: string;
  babyId: string;
  title: string;
  dueAt: string;
  status: ReminderStatus;
  source: ReminderSource;
};

export type FamilyTask = {
  id: string;
  userId: string;
  babyId: string;
  assigneeName: string;
  title: string;
  status: FamilyTaskStatus;
  dueAt: string;
};

export type TodayItem = {
  id: string;
  type: TodayItemType;
  priority: TodayPriority;
  title: string;
  description: string;
  relatedEntityId?: string;
};

export type WeeklyPlanItem = {
  id: string;
  dayLabel: string;
  title: string;
  detail: string;
  type: "appointment" | "reminder" | "task";
};

export type DashboardData = {
  user: User;
  mode: BackendMode;
  babyProfile: BabyProfile | null;
  appointments: Appointment[];
  reminders: Reminder[];
  familyTasks: FamilyTask[];
  todayItems: TodayItem[];
};

export type VaccineStation = {
  id: string;
  name: string;
  distanceLabel: string;
  addressLine: string;
  hours: string;
};
