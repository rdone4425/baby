import { getAgeInMonths } from "../utils/date";
import { createId } from "../utils/id";
import { AgentMemory, AgentObservation, AgentRecommendation } from "../types/agent";
import { getKindWeight, getPreferredAssigneeBoost, getPreferredScenarioBoost } from "./memory";

function clampConfidence(value: number) {
  return Math.max(0.2, Math.min(0.98, Number(value.toFixed(2))));
}

function priorityFromScore(score: number) {
  if (score >= 2.2) {
    return "high" as const;
  }
  if (score >= 1.2) {
    return "medium" as const;
  }
  return "low" as const;
}

function zhStageGuidance(months: number) {
  if (months < 3) {
    return "先把喂养节奏、睡眠窗口和稳定交接做好，比加更多任务更重要。";
  }
  if (months < 6) {
    return "这个阶段更适合关注趴玩、翻身和短时外出的稳定性。";
  }
  if (months < 12) {
    return "现在开始记录辅食和重复性作息，会明显提升规划质量。";
  }
  return "宝宝进入更主动探索期，家庭分工和外出准备会更影响整体体验。";
}

function enStageGuidance(months: number) {
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

function stageGuidance(months: number, locale: AgentObservation["locale"]) {
  return locale === "zh" ? zhStageGuidance(months) : enStageGuidance(months);
}

function sortByDate<T extends { dueAt?: string; startsAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const first = a.dueAt ?? a.startsAt ?? "";
    const second = b.dueAt ?? b.startsAt ?? "";
    return first.localeCompare(second);
  });
}

export function runRuleBasedStrategy(observation: AgentObservation, memory: AgentMemory) {
  const recommendations: Array<{ score: number; value: AgentRecommendation }> = [];
  const locale = observation.locale;
  const soonestAppointment = sortByDate(observation.appointments)[0];
  const soonestTask = sortByDate(observation.familyTasks)[0];
  const soonestReminder = sortByDate(observation.reminders.filter((item) => item.status !== "done"))[0];

  if (!observation.babyProfile) {
    const score = 2 + getKindWeight(memory, "onboarding");
    recommendations.push({
      score,
      value: {
        id: createId("agent-onboarding"),
        surface: "today",
        kind: "onboarding",
        title: locale === "zh" ? "先建立宝宝档案" : "Start with the baby profile",
        description:
          locale === "zh"
            ? "只有建立档案后，内核才能根据月龄和场景生成更贴近你的建议。"
            : "The kernel can only personalize planning once the baby profile exists.",
        reason:
          locale === "zh"
            ? "当前缺少月龄和喂养上下文，建议能力会受限。"
            : "Age-stage and feeding context are missing, so recommendation quality is limited.",
        priority: priorityFromScore(score),
        confidence: clampConfidence(0.88 + score * 0.01),
        sourceSignals: ["missing_baby_profile"]
      }
    });
  }

  if (observation.babyProfile) {
    const months = getAgeInMonths(observation.babyProfile.birthDate);
    const score = 1.1 + getKindWeight(memory, "stage_guidance");
    recommendations.push({
      score,
      value: {
        id: createId("agent-stage"),
        surface: "today",
        kind: "stage_guidance",
        title: locale === "zh" ? "当前月龄阶段提醒" : "Age-stage guidance",
        description: stageGuidance(months, locale),
        reason:
          locale === "zh"
            ? `根据宝宝约 ${months} 个月的阶段特征生成。`
            : `Generated from the baby's current age stage of about ${months} months.`,
        priority: priorityFromScore(score),
        confidence: clampConfidence(0.74 + score * 0.03),
        sourceSignals: ["baby_age_stage"],
        relatedEntityId: observation.babyProfile.id
      }
    });
  }

  if (soonestAppointment) {
    const score = 2.2 + getKindWeight(memory, "appointment_focus");
    recommendations.push({
      score,
      value: {
        id: createId("agent-appointment"),
        surface: "today",
        kind: "appointment_focus",
        title: locale === "zh" ? "优先准备最近预约" : "Prioritize the next appointment",
        description:
          locale === "zh"
            ? `${soonestAppointment.title}，地点：${soonestAppointment.location || "待补充"}。`
            : `${soonestAppointment.title}, location: ${soonestAppointment.location || "to be added"}.`,
        reason:
          locale === "zh"
            ? "最近预约通常是影响当日节奏的最高优先级事件。"
            : "The next appointment is usually the strongest driver of today's rhythm.",
        priority: priorityFromScore(score),
        confidence: clampConfidence(0.78 + score * 0.03),
        sourceSignals: ["upcoming_appointment"],
        relatedEntityId: soonestAppointment.id
      }
    });

    recommendations.push({
      score: score - 0.2,
      value: {
        id: createId("agent-planner-appointment"),
        surface: "planner",
        kind: "appointment_focus",
        title: locale === "zh" ? "围绕预约重排这周节奏" : "Re-shape the week around the appointment",
        description:
          locale === "zh"
            ? "把预约前的准备和预约后的恢复时间都纳入本周安排。"
            : "Fold prep time before the appointment and recovery time after it into this week.",
        reason:
          locale === "zh"
            ? "预约不仅占一个时间点，通常还会影响前后半天安排。"
            : "Appointments tend to affect the half-day around them, not just one slot.",
        priority: priorityFromScore(score - 0.2),
        confidence: clampConfidence(0.72 + score * 0.02),
        sourceSignals: ["appointment_impacts_week"],
        relatedEntityId: soonestAppointment.id
      }
    });
  }

  if (soonestReminder) {
    const score = 1.6 + getKindWeight(memory, "reminder_focus");
    recommendations.push({
      score,
      value: {
        id: createId("agent-reminder"),
        surface: "planner",
        kind: "reminder_focus",
        title: locale === "zh" ? "先处理最近提醒" : "Handle the nearest reminder first",
        description:
          locale === "zh"
            ? `${soonestReminder.title} 是最近一条未完成提醒。`
            : `${soonestReminder.title} is the nearest unfinished reminder.`,
        reason:
          locale === "zh"
            ? "提醒若被连续跳过，计划的可信度会快速下降。"
            : "Ignoring reminders repeatedly reduces the reliability of the plan quickly.",
        priority: priorityFromScore(score),
        confidence: clampConfidence(0.7 + score * 0.02),
        sourceSignals: ["unfinished_reminder"],
        relatedEntityId: soonestReminder.id
      }
    });
  }

  if (soonestTask) {
    const assigneeBoost = getPreferredAssigneeBoost(memory, soonestTask.assigneeName) * 0.1;
    const score = 1.7 + getKindWeight(memory, "task_focus") + assigneeBoost;
    recommendations.push({
      score,
      value: {
        id: createId("agent-task"),
        surface: "today",
        kind: "task_focus",
        title: locale === "zh" ? "盯住最近家庭任务" : "Keep the nearest family task visible",
        description:
          locale === "zh"
            ? `${soonestTask.title}，负责人：${soonestTask.assigneeName}。`
            : `${soonestTask.title}, owned by ${soonestTask.assigneeName}.`,
        reason:
          locale === "zh"
            ? "家庭任务如果没人显式接住，最容易在交接时丢掉。"
            : "Family tasks are most likely to slip during handoffs unless someone clearly owns them.",
        priority: priorityFromScore(score),
        confidence: clampConfidence(0.69 + score * 0.03),
        sourceSignals: ["upcoming_family_task", `assignee:${soonestTask.assigneeName}`],
        relatedEntityId: soonestTask.id,
        metadata: {
          assigneeName: soonestTask.assigneeName
        }
      }
    });

    recommendations.push({
      score: score - 0.05,
      value: {
        id: createId("agent-family"),
        surface: "family",
        kind: "family_handoff",
        title: locale === "zh" ? "给家庭分工一个更明确的接手点" : "Tighten the caregiver handoff",
        description:
          locale === "zh"
            ? `优先确认 ${soonestTask.assigneeName} 是否还适合接手“${soonestTask.title}”。`
            : `Confirm whether ${soonestTask.assigneeName} is still the right owner for "${soonestTask.title}".`,
        reason:
          locale === "zh"
            ? "系统检测到近期家庭任务会直接影响交接清晰度。"
            : "A near-term family task is likely to shape how clear the next handoff feels.",
        priority: priorityFromScore(score - 0.05),
        confidence: clampConfidence(0.68 + score * 0.02),
        sourceSignals: ["handoff_risk", `assignee:${soonestTask.assigneeName}`],
        relatedEntityId: soonestTask.id,
        metadata: {
          assigneeName: soonestTask.assigneeName
        }
      }
    });
  }

  const outingBoost = getPreferredScenarioBoost(memory, observation.outingScenario) * 0.08;
  const outingScore = 1.3 + getKindWeight(memory, "outing_prep") + outingBoost;
  recommendations.push({
    score: outingScore,
    value: {
      id: createId("agent-outing"),
      surface: "outings",
      kind: "outing_prep",
      title: locale === "zh" ? "按当前外出场景先准备核心清单" : "Prepare the core list for this outing",
      description:
        locale === "zh"
          ? "当前场景会优先生成与你最近外出习惯更接近的准备建议。"
          : "This scenario will bias the checklist toward your recent successful outing patterns.",
      reason:
        locale === "zh"
          ? "系统结合了场景模板、月龄和你最近更常用的外出类型。"
          : "The checklist blends scenario templates, baby age, and your most successful recent outing type.",
      priority: priorityFromScore(outingScore),
      confidence: clampConfidence(0.66 + outingScore * 0.03),
      sourceSignals: ["outing_scenario", `scenario:${observation.outingScenario}`],
      metadata: {
        outingScenario: observation.outingScenario
      }
    }
  });

  if (!soonestAppointment && !soonestTask && !soonestReminder && observation.babyProfile) {
    const score = 1.4 + getKindWeight(memory, "onboarding");
    recommendations.push({
      score,
      value: {
        id: createId("agent-onboarding-next"),
        surface: "planner",
        kind: "onboarding",
        title: locale === "zh" ? "补一个本周关键提醒" : "Add one key reminder for this week",
        description:
          locale === "zh"
            ? "这样内核才能开始根据结果学习什么对你真正重要。"
            : "That gives the kernel enough signal to learn what matters most to you.",
        reason:
          locale === "zh"
            ? "当前缺少近期事件，建议系统还没有足够行为样本。"
            : "There are not enough near-term events yet for the system to learn from.",
        priority: priorityFromScore(score),
        confidence: clampConfidence(0.62 + score * 0.02),
        sourceSignals: ["low_activity_state"]
      }
    });
  }

  return recommendations
    .sort((a, b) => b.score - a.score)
    .map((entry) => ({
      ...entry.value,
      confidence: clampConfidence(entry.value.confidence)
    }));
}
