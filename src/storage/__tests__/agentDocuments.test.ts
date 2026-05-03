const store = new Map<string, string>();

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => store.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    })
  }
}));

import { loadSoul, loadUserMemory, saveUserMemory, saveUserMemoryLocation } from "../agentDocuments";

describe("agentDocuments", () => {
  beforeEach(() => {
    store.clear();
  });

  it("initializes local soul and user memory documents from templates", async () => {
    const soul = await loadSoul();
    const user = await loadUserMemory();

    expect(soul.meta.role).toBe("Baby Weekly Companion");
    expect(user.snapshot.userId).toBe("unknown");
  });

  it("persists a saved user memory snapshot", async () => {
    const user = await loadUserMemory();
    const next = await saveUserMemory(
      {
        ...user.snapshot,
        userId: "demo-user",
        userName: "Demo Parent",
        summaryNotes: ["Local memory was updated."]
      },
      user.events
    );

    expect(next.snapshot.userId).toBe("demo-user");
    expect(next.snapshot.summaryNotes[0]).toContain("updated");
  });

  it("writes confirmed location into user memory markdown", async () => {
    await loadUserMemory();
    const next = await saveUserMemoryLocation({
      preferredLocale: "zh",
      country: "China",
      region: "Shanghai",
      street: "Pudong"
    });

    expect(next.snapshot.preferredLocale).toBe("zh");
    expect(next.snapshot.country).toBe("China");
    expect(next.snapshot.region).toBe("Shanghai");
    expect(next.snapshot.street).toBe("Pudong");
    expect(next.snapshot.summaryNotes[0]).toContain("Shanghai");
  });
});
