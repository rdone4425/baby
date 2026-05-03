import { FeedingMode, Locale, OutingScenario, TabKey } from "../types/domain";

export type Copy = {
  languageLabel: string;
  languageOptions: Record<Locale, string>;
  heroBadge: string;
  heroTitle: string;
  heroCopy: string;
  tabLabels: Record<TabKey, string>;
  screenEyebrows: Record<TabKey, string>;
  updateButton: string;
  updateStatus: Record<
    | "idle"
    | "checking"
    | "downloading"
    | "applying"
    | "unavailableDev"
    | "unavailableConfig"
    | "upToDate"
    | "failed",
    string
  >;
  appMode: {
    mockTitle: string;
    mockBody: string;
    remoteTitle: string;
    remoteBody: string;
  };
  auth: {
    title: string;
    sendMagicLink: string;
  };
  agent: {
    title: string;
    refresh: string;
    accept: string;
    ignore: string;
    notRelevant: string;
    showReason: string;
    hideReason: string;
    reasonTitle: string;
    sourceTitle: string;
    noRecommendations: string;
    memoryHint: string;
    plannerHint: string;
    outingHint: string;
    familyHint: string;
  };
  profile: {
    title: string;
    emptyTitle: string;
    emptyBody: string;
    name: string;
    birthDate: string;
    feedingMode: string;
    notes: string;
    save: string;
    edit: string;
    feedingModes: Record<FeedingMode, string>;
  };
  today: {
    title: string;
    empty: string;
  };
  planner: {
    title: string;
    appointmentsTitle: string;
    remindersTitle: string;
    nextActionTitle: string;
    appointmentFormTitle: string;
    reminderFormTitle: string;
    appointmentFields: {
      title: string;
      startsAt: string;
      location: string;
      notes: string;
    };
    reminderFields: {
      title: string;
      dueAt: string;
    };
    saveAppointment: string;
    saveReminder: string;
  };
  outings: {
    title: string;
    helper: string;
    scenarioLabel: string;
    scenarios: Record<OutingScenario, string>;
    addItem: string;
    checklistPlaceholder: string;
  };
  family: {
    title: string;
    empty: string;
    formTitle: string;
    assignee: string;
    task: string;
    dueAt: string;
    save: string;
  };
  generic: {
    loading: string;
    errorPrefix: string;
    retry: string;
    saveSucceeded: string;
    saveFailed: string;
    emailPlaceholder: string;
    magicLinkUnavailable: string;
  };
};
