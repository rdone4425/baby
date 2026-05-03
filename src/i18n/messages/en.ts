import { Copy } from "../types";

export const en: Copy = {
  languageLabel: "Language",
  languageOptions: {
    en: "EN",
    zh: "中文"
  },
  heroBadge: "Baby Weekly Companion",
  heroTitle: "A calmer planning app for new parents.",
  heroCopy:
    "Turn baby logistics into one mobile flow with age-aware priorities, weekly planning, outing prep, and caregiver coordination.",
  tabLabels: {
    today: "Today",
    planner: "Planner",
    outings: "Outings",
    family: "Family"
  },
  screenEyebrows: {
    today: "Daily focus",
    planner: "Weekly rhythm",
    outings: "Leave-home prep",
    family: "Caregiver sync"
  },
  updateButton: "Check for updates",
  updateStatus: {
    idle: "Look for newer app content in production-ready builds.",
    checking: "Checking for updates...",
    downloading: "Update found. Downloading...",
    applying: "Applying update...",
    unavailableDev: "In-app updates are unavailable in development builds.",
    unavailableConfig: "This build is not yet configured for OTA updates.",
    upToDate: "You're already on the latest version.",
    failed: "Update check failed. Please try again."
  },
  appMode: {
    mockTitle: "Demo mode is active",
    mockBody:
      "The app is using a local mock repository with the same shape as the planned backend. You can still create and persist core data on this device.",
    remoteTitle: "Backend mode is active",
    remoteBody: "The app is connected to a configured backend repository."
  },
  auth: {
    title: "Account access",
    sendMagicLink: "Send magic link"
  },
  agent: {
    title: "Agent suggestions",
    refresh: "Re-run agent",
    accept: "Accept",
    ignore: "Ignore",
    notRelevant: "Not relevant",
    showReason: "Why this?",
    hideReason: "Hide reason",
    reasonTitle: "Reason",
    sourceTitle: "Signals",
    noRecommendations: "The agent needs a little more context before it can produce strong suggestions.",
    memoryHint: "The agent learns from what you accept, ignore, or act on later.",
    plannerHint: "These planner notes are influenced by what the agent has learned from your recent routines.",
    outingHint: "This outing suggestion uses the current scenario plus your recent successful patterns.",
    familyHint: "Family suggestions will improve as the agent sees who usually takes which task."
  },
  profile: {
    title: "Baby profile",
    emptyTitle: "Start with one baby profile",
    emptyBody: "Create the baby profile once and the rest of the app can derive age-stage guidance, planning, and outing defaults.",
    name: "Baby name",
    birthDate: "Birth date (YYYY-MM-DD)",
    feedingMode: "Feeding mode",
    notes: "Notes",
    save: "Save profile",
    edit: "Edit profile",
    feedingModes: {
      breast: "Breastfeeding",
      formula: "Formula",
      mixed: "Mixed",
      solids: "Solids started"
    }
  },
  today: {
    title: "What matters now",
    empty: "Add an appointment or family task to generate a more useful Today view."
  },
  planner: {
    title: "This week's plan",
    appointmentsTitle: "Appointments",
    remindersTitle: "Reminders",
    nextActionTitle: "Next best action",
    appointmentFormTitle: "Add appointment",
    reminderFormTitle: "Add reminder",
    appointmentFields: {
      title: "Appointment title",
      startsAt: "Starts at (YYYY-MM-DDTHH:MM)",
      location: "Location",
      notes: "Notes"
    },
    reminderFields: {
      title: "Reminder title",
      dueAt: "Due at (YYYY-MM-DDTHH:MM)"
    },
    saveAppointment: "Save appointment",
    saveReminder: "Save reminder"
  },
  outings: {
    title: "Context-aware outing checklist",
    helper: "Pick a scenario to generate a checklist, then mark what is packed or add custom items.",
    scenarioLabel: "Scenario",
    scenarios: {
      clinic: "Clinic visit",
      park: "Park walk",
      grocery: "Quick grocery run",
      familyVisit: "Family visit"
    },
    addItem: "Add checklist item",
    checklistPlaceholder: "Custom checklist item"
  },
  family: {
    title: "Shared caregiver work",
    empty: "No shared tasks yet. Add one task to coordinate handoffs.",
    formTitle: "Add family task",
    assignee: "Assignee",
    task: "Task",
    dueAt: "Due at (YYYY-MM-DDTHH:MM)",
    save: "Save task"
  },
  generic: {
    loading: "Loading...",
    errorPrefix: "Something went wrong",
    retry: "Retry",
    saveSucceeded: "Saved.",
    saveFailed: "Save failed.",
    emailPlaceholder: "Email for magic link",
    magicLinkUnavailable: "Magic link is only available when a backend is configured."
  }
};
