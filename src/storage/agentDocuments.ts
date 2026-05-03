import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadSoulTemplate, createDefaultUserMemoryDocument, parseSoul, parseUserMemory, serializeUserMemory } from "../agent/documentSchema";
import { AgentRun, SoulDocument, UserMemoryDocument, UserMemoryEvent, UserMemorySnapshot } from "../types/agent";

const SOUL_STORAGE_KEY = "baby-agent-mobile/documents/soul";
const USER_MEMORY_STORAGE_KEY = "baby-agent-mobile/documents/user";

export async function loadSoul(): Promise<SoulDocument> {
  const existing = await AsyncStorage.getItem(SOUL_STORAGE_KEY);
  if (existing) {
    return parseSoul(existing);
  }

  const soul = loadSoulTemplate();
  await AsyncStorage.setItem(SOUL_STORAGE_KEY, soul.rawMarkdown);
  return soul;
}

export async function loadUserMemory(): Promise<UserMemoryDocument> {
  const existing = await AsyncStorage.getItem(USER_MEMORY_STORAGE_KEY);
  if (existing) {
    return parseUserMemory(existing);
  }

  const document = createDefaultUserMemoryDocument();
  await AsyncStorage.setItem(USER_MEMORY_STORAGE_KEY, document.rawMarkdown);
  return document;
}

export async function saveUserMemory(snapshot: UserMemorySnapshot, events: UserMemoryEvent[]) {
  const markdown = serializeUserMemory(snapshot, events);
  await AsyncStorage.setItem(USER_MEMORY_STORAGE_KEY, markdown);
  return parseUserMemory(markdown);
}

export async function saveUserMemoryLocation(input: { preferredLocale?: string; country: string; region: string; street: string }) {
  const current = await loadUserMemory();
  const summary = `Location confirmed for ${[input.country, input.region, input.street].filter(Boolean).join(", ")}.`;
  return saveUserMemory(
    {
      ...current.snapshot,
      preferredLocale: input.preferredLocale ?? current.snapshot.preferredLocale,
      country: input.country,
      region: input.region,
      street: input.street,
      summaryNotes: [summary, ...current.snapshot.summaryNotes.filter((note) => note !== summary)].slice(0, 5)
    },
    current.events
  );
}

export function getLatestRunFromUserMemory(document: UserMemoryDocument): AgentRun | null {
  if (document.snapshot.latestRun) {
    return document.snapshot.latestRun;
  }

  for (const event of document.events) {
    if (event.type === "agent_run" && event.payload?.run) {
      return event.payload.run as AgentRun;
    }
  }

  return null;
}
