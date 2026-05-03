import {
  Appointment,
  BabyProfile,
  FamilyTask,
  Locale,
  OutingChecklistItem,
  OutingScenario,
  Reminder,
  TodayItem,
  WeeklyPlanItem
} from "../../types/domain";
import { createId } from "../../utils/id";
import { getAgeInMonths, getRelativeDayLabel } from "../../utils/date";

function getStageGuidance(months: number, locale: Locale) {
  if (locale === "zh") {
    if (months < 3) {
      return "建立喂养节奏、睡眠窗口和稳定交接，比追求完美更重要。";
    }
    if (months < 6) {
      return "这个阶段更适合关注趴玩、翻身和短时外出的稳定性。";
    }
    if (months < 12) {
      return "开始记录辅食和重复性作息，会明显提升规划质量。";
    }
    return "宝宝进入更主动探索期，家庭分工和外出准备会更影响整体体验。";
  }

  if (months < 3) {
    return "Protect the basics first: feeding rhythm, sleep windows, and stable handoffs.";
  }
  if (months < 6) {
    return "This phase benefits from tummy time consistency and shorter, calmer outings.";
  }
  if (months < 12) {
    return "Tracking solids and repeatable routines will now improve planning quality.";
  }
  return "Curiosity is rising, so caregiver alignment and outing prep matter more than extra content.";
}

export function deriveTodayItems(
  locale: Locale,
  babyProfile: BabyProfile | null,
  appointments: Appointment[],
  familyTasks: FamilyTask[]
) {
  const items: TodayItem[] = [];
  const sortedAppointments = [...appointments].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const sortedTasks = [...familyTasks].sort((a, b) => a.dueAt.localeCompare(b.dueAt));

  if (sortedAppointments[0]) {
    items.push({
      id: createId("today-appointment"),
      type: "appointment",
      priority: "high",
      title: sortedAppointments[0].title,
      description:
        locale === "zh"
          ? `最近预约地点：${sortedAppointments[0].location || "待补充"}`
          : `Nearest appointment location: ${sortedAppointments[0].location || "To be added"}`,
      relatedEntityId: sortedAppointments[0].id
    });
  }

  if (sortedTasks[0]) {
    items.push({
      id: createId("today-task"),
      type: "task",
      priority: "medium",
      title: sortedTasks[0].title,
      description:
        locale === "zh"
          ? `负责人：${sortedTasks[0].assigneeName}`
          : `Assigned to ${sortedTasks[0].assigneeName}`,
      relatedEntityId: sortedTasks[0].id
    });
  }

  if (babyProfile) {
    items.push({
      id: createId("today-stage"),
      type: "stage",
      priority: "low",
      title: locale === "zh" ? "当前月龄提醒" : "Age-stage note",
      description: getStageGuidance(getAgeInMonths(babyProfile.birthDate), locale),
      relatedEntityId: babyProfile.id
    });
  }

  return items;
}

export function deriveWeeklyPlan(
  locale: Locale,
  appointments: Appointment[],
  reminders: Reminder[],
  familyTasks: FamilyTask[]
) {
  const combined: WeeklyPlanItem[] = [
    ...appointments.map((item) => ({
      id: item.id,
      dayLabel: getRelativeDayLabel(item.startsAt, locale),
      title: item.title,
      detail: item.location || item.notes || (locale === "zh" ? "待补充细节" : "Add detail"),
      type: "appointment" as const
    })),
    ...reminders.map((item) => ({
      id: item.id,
      dayLabel: getRelativeDayLabel(item.dueAt, locale),
      title: item.title,
      detail: locale === "zh" ? "提醒事项" : "Reminder",
      type: "reminder" as const
    })),
    ...familyTasks.map((item) => ({
      id: item.id,
      dayLabel: getRelativeDayLabel(item.dueAt, locale),
      title: item.title,
      detail: locale === "zh" ? `负责人：${item.assigneeName}` : `Owner: ${item.assigneeName}`,
      type: "task" as const
    }))
  ];

  return combined.sort((a, b) => a.dayLabel.localeCompare(b.dayLabel));
}

export function deriveNextAction(locale: Locale, reminders: Reminder[]) {
  const nextReminder = [...reminders].sort((a, b) => a.dueAt.localeCompare(b.dueAt))[0];
  if (!nextReminder) {
    return locale === "zh"
      ? "先补一个本周最关键的提醒，系统就能开始帮你排优先级。"
      : "Add one important reminder this week and the planner will start prioritizing around it.";
  }

  return locale === "zh"
    ? `下一步建议：先完成“${nextReminder.title}”。`
    : `Next best action: finish "${nextReminder.title}" first.`;
}

export function buildOutingChecklist(
  locale: Locale,
  scenario: OutingScenario,
  babyProfile: BabyProfile | null
) {
  const ageMonths = babyProfile ? getAgeInMonths(babyProfile.birthDate) : 0;
  const baseByScenario: Record<OutingScenario, string[]> = {
    clinic:
      locale === "zh"
        ? ["就诊卡或保险信息", "备用衣物", "喂养用品"]
        : ["Clinic card or insurance info", "Spare outfit", "Feeding essentials"],
    park:
      locale === "zh"
        ? ["遮阳或挡风层", "便携垫", "安抚玩具"]
        : ["Shade or wind layer", "Portable mat", "Comfort toy"],
    grocery:
      locale === "zh"
        ? ["快速喂养备用品", "湿巾", "短时外出玩具"]
        : ["Quick feeding backup", "Wipes", "Short-trip toy"],
    familyVisit:
      locale === "zh"
        ? ["额外口水巾", "睡眠安抚物", "换尿布小包"]
        : ["Extra bib", "Sleep comfort item", "Diaper pouch"]
  };

  const ageSpecific =
    locale === "zh"
      ? ageMonths >= 6
        ? ["辅食小勺或围兜"]
        : ["包巾或轻薄盖毯"]
      : ageMonths >= 6
        ? ["Starter spoon or bib"]
        : ["Swaddle or light blanket"];

  return [...baseByScenario[scenario], ...ageSpecific].map((label) => ({
    id: createId("outing"),
    label,
    packed: false
  })) as OutingChecklistItem[];
}
