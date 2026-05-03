import { createEmptyAgentMemory, normalizeAgentMemory } from "./memory";
import { SOUL_TEMPLATE, USER_TEMPLATE } from "./documentTemplates";
import { SoulDocument, SoulDocumentMeta, UserMemoryDocument, UserMemoryEvent, UserMemorySnapshot } from "../types/agent";

const SOUL_META_PATTERN = /```json meta\s*([\s\S]*?)```/;
const SNAPSHOT_PATTERN = /```json snapshot\s*([\s\S]*?)```/;
const EVENT_PATTERN = /### EVENT ([^\n]+)\n```json event\s*([\s\S]*?)```/g;

const DEFAULT_USER_MEMORY_SNAPSHOT: UserMemorySnapshot = {
  schemaVersion: "1.0.0",
  userId: "unknown",
  userName: "",
  userEmail: "",
  preferredLocale: null,
  country: null,
  region: null,
  street: null,
  babyName: null,
  babyBirthDate: null,
  feedingMode: null,
  profileNotes: null,
  activeTaskCount: 0,
  reminderCount: 0,
  appointmentCount: 0,
  summaryNotes: ["No family-specific memory has been captured yet."],
  memory: createEmptyAgentMemory(),
  latestRun: null
};

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseSoul(markdown: string): SoulDocument {
  const match = markdown.match(SOUL_META_PATTERN);
  const meta = safeJsonParse<SoulDocumentMeta>(match?.[1] ?? "{}", {
    version: "1.0.0",
    role: "Baby Weekly Companion",
    mission: "Turn local family data into calm, actionable weekly guidance for caregivers.",
    tone: "Warm, practical, reassuring, and never alarmist."
  });

  return {
    meta,
    rawMarkdown: markdown
  };
}

export function loadSoulTemplate() {
  return parseSoul(SOUL_TEMPLATE);
}

export function parseUserMemory(markdown: string): UserMemoryDocument {
  const snapshotMatch = markdown.match(SNAPSHOT_PATTERN);
  const snapshotInput = safeJsonParse<UserMemorySnapshot>(snapshotMatch?.[1] ?? "{}", DEFAULT_USER_MEMORY_SNAPSHOT);

  const events: UserMemoryEvent[] = [];
  for (const match of markdown.matchAll(EVENT_PATTERN)) {
    const event = safeJsonParse<UserMemoryEvent>(match[2], {
      id: match[1],
      type: "feedback",
      createdAt: new Date(0).toISOString(),
      title: "Unknown event",
      summary: "",
      payload: {}
    });
    events.push(event);
  }

  const snapshot: UserMemorySnapshot = {
    ...DEFAULT_USER_MEMORY_SNAPSHOT,
    ...snapshotInput,
    memory: normalizeAgentMemory(snapshotInput.memory ?? DEFAULT_USER_MEMORY_SNAPSHOT.memory),
    latestRun: snapshotInput.latestRun ?? null,
    summaryNotes: snapshotInput.summaryNotes?.length ? snapshotInput.summaryNotes : DEFAULT_USER_MEMORY_SNAPSHOT.summaryNotes
  };

  return {
    snapshot,
    events,
    rawMarkdown: markdown
  };
}

export function serializeUserMemory(snapshot: UserMemorySnapshot, events: UserMemoryEvent[]) {
  const eventSection = events.length
    ? events
        .map(
          (event) =>
            `### EVENT ${event.id}\n\`\`\`json event\n${JSON.stringify(event, null, 2)}\n\`\`\``
        )
        .join("\n\n")
    : "No memory events yet.";

  return `# User Memory

## Snapshot

\`\`\`json snapshot
${JSON.stringify(
  {
    ...snapshot,
    memory: normalizeAgentMemory(snapshot.memory ?? createEmptyAgentMemory())
  },
  null,
  2
)}
\`\`\`

## Event Log

${eventSection}
`;
}

export function createDefaultUserMemoryDocument() {
  return parseUserMemory(USER_TEMPLATE);
}
