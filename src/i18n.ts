export type Locale = "en" | "zh";

export type TabKey = "today" | "planner" | "outings" | "family";

type TodayCard = {
  eyebrow: string;
  title: string;
  description: string;
  tone: "urgent" | "calm" | "info";
};

type WeeklyPlanItem = {
  day: string;
  title: string;
  detail: string;
};

type FamilyItem = {
  role: string;
  task: string;
  status: string;
};

type UpdateCopy = {
  button: string;
  idle: string;
  checking: string;
  downloading: string;
  applying: string;
  unavailableDev: string;
  unavailableConfig: string;
  upToDate: string;
  readyToReload: string;
  failed: string;
};

type Copy = {
  languageLabel: string;
  languageOptions: Record<Locale, string>;
  heroBadge: string;
  heroTitle: string;
  heroCopy: string;
  metrics: Array<{ value: string; label: string }>;
  update: UpdateCopy;
  sectionEyebrow: string;
  activeHeadline: Record<TabKey, string>;
  tabs: Record<TabKey, string>;
  todayCards: TodayCard[];
  weeklyPlanTitle: string;
  weeklyPlan: WeeklyPlanItem[];
  weeklyNextAction: string;
  outingEyebrow: string;
  outingTitle: string;
  outingCopy: string;
  packListTitle: string;
  outingChecklist: string[];
  familyTitle: string;
  familyFeed: FamilyItem[];
  familyNote: string;
  footerTitle: string;
  footerCopy: string;
};

export const copyByLocale: Record<Locale, Copy> = {
  en: {
    languageLabel: "Language",
    languageOptions: {
      en: "EN",
      zh: "中文"
    },
    heroBadge: "Baby Weekly Companion",
    heroTitle: "A proactive baby planning app for new parents.",
    heroCopy:
      "Weekly priorities, appointment prep, outing clarity, and family coordination in one calm mobile flow.",
    metrics: [
      { value: "3", label: "priority actions" },
      { value: "1", label: "upcoming visit" },
      { value: "4", label: "caregivers synced" }
    ],
    update: {
      button: "Check for updates",
      idle: "Use this button to look for newer app content.",
      checking: "Checking for updates...",
      downloading: "Update found. Downloading...",
      applying: "Applying update...",
      unavailableDev: "In-app updates are not available in development builds.",
      unavailableConfig: "This build is not configured for OTA updates yet.",
      upToDate: "You're already on the latest version.",
      readyToReload: "Update installed. Restarting the app...",
      failed: "Update check failed. Please try again."
    },
    sectionEyebrow: "Agent view",
    activeHeadline: {
      today: "What matters now",
      planner: "This week's rhythm",
      outings: "Leave home with less chaos",
      family: "Keep every caregiver aligned"
    },
    tabs: {
      today: "Today",
      planner: "Planner",
      outings: "Outings",
      family: "Family"
    },
    todayCards: [
      {
        eyebrow: "This morning",
        title: "6-month vaccine visit tomorrow",
        description: "Pack the immunization card, spare outfit, and bottle before 9 PM tonight.",
        tone: "urgent"
      },
      {
        eyebrow: "Age signal",
        title: "Solid food week starts now",
        description: "Focus on one iron-rich food this week and log reactions for clarity, not perfection.",
        tone: "calm"
      },
      {
        eyebrow: "Weather-aware",
        title: "Windy afternoon stroller plan",
        description: "Use one extra light layer and keep the outing under 45 minutes after the appointment.",
        tone: "info"
      }
    ],
    weeklyPlanTitle: "Weekly plan",
    weeklyPlan: [
      {
        day: "Mon",
        title: "Pediatrician prep",
        detail: "Confirm time, refill wipes pouch, and add questions about rash."
      },
      {
        day: "Wed",
        title: "Family sync",
        detail: "Grandma handles pickup kit, dad reviews bedtime supplies."
      },
      {
        day: "Fri",
        title: "Feeding checkpoint",
        detail: "Review first-food notes and generate next-week shopping list."
      }
    ],
    weeklyNextAction: "Next best action: generate a Friday summary for both parents after the feeding checkpoint.",
    outingEyebrow: "Context-aware outing guidance",
    outingTitle: "59F, breezy, clinic visit at 3:30 PM",
    outingCopy: "Keep the core warm, avoid overdressing, and optimize for a smooth wait-room handoff.",
    packListTitle: "Pack list",
    outingChecklist: [
      "Bottle or feeding backup",
      "Changing pouch",
      "One warm layer for transit",
      "Clinic card and insurance note",
      "Comfort toy for waiting room"
    ],
    familyTitle: "Caregiver coordination",
    familyFeed: [
      {
        role: "Mom",
        task: "Tracks feeding responses",
        status: "In progress"
      },
      {
        role: "Dad",
        task: "Owns tomorrow's appointment bag",
        status: "Ready"
      },
      {
        role: "Grandma",
        task: "Afternoon walk backup",
        status: "Needs update"
      }
    ],
    familyNote: "Shared reminders and handoffs are where the family plan becomes subscription-worthy.",
    footerTitle: "Product guardrails",
    footerCopy:
      "This app helps parents organize next actions. It does not replace pediatricians or provide medical diagnosis."
  },
  zh: {
    languageLabel: "语言",
    languageOptions: {
      en: "EN",
      zh: "中文"
    },
    heroBadge: "宝宝每周陪伴助手",
    heroTitle: "一个会主动帮新手父母做计划的宝宝事项 App。",
    heroCopy: "把每周重点、预约准备、外出清单和家庭协作放进一个更清晰、更省心的手机流程里。",
    metrics: [
      { value: "3", label: "今日重点" },
      { value: "1", label: "即将预约" },
      { value: "4", label: "照护人同步" }
    ],
    update: {
      button: "检查更新",
      idle: "点这里检查有没有新的应用内容，不需要去 GitHub 下载。",
      checking: "正在检查更新...",
      downloading: "发现新版本内容，正在下载...",
      applying: "正在应用更新...",
      unavailableDev: "开发版里暂时不能使用应用内更新。",
      unavailableConfig: "当前这个安装包还没有接好 OTA 更新配置。",
      upToDate: "已经是最新版本了。",
      readyToReload: "更新已安装，正在重启应用...",
      failed: "检查更新失败，请稍后再试。"
    },
    sectionEyebrow: "Agent 视图",
    activeHeadline: {
      today: "现在最重要的事",
      planner: "这周的节奏",
      outings: "让出门少一点混乱",
      family: "让照护人保持同步"
    },
    tabs: {
      today: "今天",
      planner: "计划",
      outings: "外出",
      family: "家庭"
    },
    todayCards: [
      {
        eyebrow: "今天早上",
        title: "明天有 6 个月疫苗预约",
        description: "今晚 9 点前把接种卡、备用衣服和奶瓶准备好。",
        tone: "urgent"
      },
      {
        eyebrow: "月龄信号",
        title: "这一周开始进入辅食阶段",
        description: "这周先专注一种富含铁的食物，把反应记清楚，不追求复杂。",
        tone: "calm"
      },
      {
        eyebrow: "天气相关",
        title: "下午有风，适合短时推车外出",
        description: "多加一层轻薄衣物，预约结束后的外出时长控制在 45 分钟内。",
        tone: "info"
      }
    ],
    weeklyPlanTitle: "每周计划",
    weeklyPlan: [
      {
        day: "周一",
        title: "儿科预约准备",
        detail: "确认时间，补齐湿巾包，并记下关于湿疹要问的问题。"
      },
      {
        day: "周三",
        title: "家庭同步",
        detail: "奶奶负责外出备用包，爸爸检查睡前用品。"
      },
      {
        day: "周五",
        title: "喂养复盘",
        detail: "整理第一阶段辅食记录，并生成下周购物清单。"
      }
    ],
    weeklyNextAction: "下一步建议：周五喂养复盘后，自动生成一份给爸妈都能看的周总结。",
    outingEyebrow: "场景化外出建议",
    outingTitle: "15°C、有风，下午 3:30 有门诊预约",
    outingCopy: "核心思路是保暖但不过度，重点优化候诊和出门交接体验。",
    packListTitle: "外出清单",
    outingChecklist: [
      "奶瓶或喂养备用品",
      "换尿布小包",
      "路上多一层薄外套",
      "门诊卡和保险信息",
      "候诊安抚玩具"
    ],
    familyTitle: "照护协作",
    familyFeed: [
      {
        role: "妈妈",
        task: "记录辅食反应",
        status: "进行中"
      },
      {
        role: "爸爸",
        task: "负责明天的预约外出包",
        status: "已准备"
      },
      {
        role: "奶奶",
        task: "下午散步兜底安排",
        status: "待确认"
      }
    ],
    familyNote: "共享提醒和交接清晰，才是家庭版订阅真正有价值的地方。",
    footerTitle: "产品边界",
    footerCopy: "这个 App 帮父母整理下一步行动，不替代儿科医生，也不提供医疗诊断。"
  }
};

export function detectInitialLocale(): Locale {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
  return locale.startsWith("zh") ? "zh" : "en";
}
