import { Copy } from "../types";

export const zh: Copy = {
  languageLabel: "语言",
  languageOptions: {
    en: "EN",
    zh: "中文"
  },
  heroBadge: "宝宝每周陪伴助手",
  heroTitle: "给新手爸妈更从容的育儿规划 App。",
  heroCopy: "把月龄提醒、每周安排、外出准备和照护协作放进一个更清晰的移动流程里。",
  tabLabels: {
    today: "今天",
    planner: "计划",
    outings: "外出",
    family: "家庭"
  },
  screenEyebrows: {
    today: "当下重点",
    planner: "本周节奏",
    outings: "出门准备",
    family: "照护协作"
  },
  updateButton: "检查更新",
  updateStatus: {
    idle: "在非开发构建中检查是否有新的应用内容。",
    checking: "正在检查更新...",
    downloading: "发现更新，正在下载...",
    applying: "正在应用更新...",
    unavailableDev: "开发构建中暂不支持应用内更新。",
    unavailableConfig: "当前构建还没有完成 OTA 更新配置。",
    upToDate: "已经是最新版本。",
    failed: "更新检查失败，请稍后重试。"
  },
  appMode: {
    mockTitle: "当前为演示模式",
    mockBody: "应用正在使用与计划后端同结构的本地 mock 仓库。你仍然可以在当前设备上创建并持久保存核心数据。",
    remoteTitle: "当前为后端模式",
    remoteBody: "应用已连接到已配置的后端仓库。"
  },
  auth: {
    title: "账号接入",
    sendMagicLink: "发送 magic link"
  },
  agent: {
    title: "Agent 建议",
    refresh: "重新生成建议",
    accept: "采纳",
    ignore: "忽略",
    notRelevant: "不适用",
    showReason: "查看原因",
    hideReason: "收起原因",
    reasonTitle: "原因",
    sourceTitle: "信号来源",
    noRecommendations: "当前上下文还不够多，Agent 还生成不了足够强的建议。",
    memoryHint: "Agent 会根据你采纳、忽略和后续行为逐步调整排序。",
    plannerHint: "这些计划提示会受到 Agent 最近学到的习惯和偏好影响。",
    outingHint: "这条外出建议结合了当前场景和你最近更常成功使用的模式。",
    familyHint: "随着 Agent 观察到谁更常接手哪类任务，家庭建议会越来越准。"
  },
  profile: {
    title: "宝宝档案",
    emptyTitle: "先创建一个宝宝档案",
    emptyBody: "创建档案后，系统才能根据月龄生成提醒、规划和外出默认建议。",
    name: "宝宝昵称",
    birthDate: "出生日期（YYYY-MM-DD）",
    feedingMode: "喂养方式",
    notes: "备注",
    save: "保存档案",
    edit: "编辑档案",
    feedingModes: {
      breast: "母乳",
      formula: "奶粉",
      mixed: "混合喂养",
      solids: "已开始辅食"
    }
  },
  today: {
    title: "现在最重要的事",
    empty: "先添加预约或家庭任务，Today 才会更有价值。"
  },
  planner: {
    title: "这周计划",
    appointmentsTitle: "预约",
    remindersTitle: "提醒",
    nextActionTitle: "下一步建议",
    appointmentFormTitle: "添加预约",
    reminderFormTitle: "添加提醒",
    appointmentFields: {
      title: "预约标题",
      startsAt: "开始时间（YYYY-MM-DDTHH:MM）",
      location: "地点",
      notes: "备注"
    },
    reminderFields: {
      title: "提醒标题",
      dueAt: "截止时间（YYYY-MM-DDTHH:MM）"
    },
    saveAppointment: "保存预约",
    saveReminder: "保存提醒"
  },
  outings: {
    title: "场景化外出清单",
    helper: "先选外出场景生成清单，再勾选已准备项目或补充自定义项目。",
    scenarioLabel: "场景",
    scenarios: {
      clinic: "门诊就诊",
      park: "公园散步",
      grocery: "短时买菜",
      familyVisit: "探亲拜访"
    },
    addItem: "添加清单项",
    checklistPlaceholder: "自定义清单项"
  },
  family: {
    title: "照护协作",
    empty: "还没有共享任务。先加一个任务，让交接更清楚。",
    formTitle: "添加家庭任务",
    assignee: "负责人",
    task: "任务内容",
    dueAt: "截止时间（YYYY-MM-DDTHH:MM）",
    save: "保存任务"
  },
  generic: {
    loading: "加载中...",
    errorPrefix: "出错了",
    retry: "重试",
    saveSucceeded: "已保存。",
    saveFailed: "保存失败。",
    emailPlaceholder: "用于 magic link 的邮箱",
    magicLinkUnavailable: "只有配置后端后才支持 magic link 登录。"
  }
};
