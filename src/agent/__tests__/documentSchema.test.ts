import { createEmptyAgentMemory } from "../memory";
import { SOUL_TEMPLATE, USER_TEMPLATE } from "../documentTemplates";
import { parseSoul, parseUserMemory, serializeUserMemory } from "../documentSchema";

describe("documentSchema", () => {
  it("parses soul metadata from markdown", () => {
    const soul = parseSoul(SOUL_TEMPLATE);

    expect(soul.meta.version).toBe("1.0.0");
    expect(soul.meta.role).toContain("Baby Weekly Companion");
  });

  it("round-trips a structured user memory document", () => {
    const document = parseUserMemory(USER_TEMPLATE);
    const nextSnapshot = {
      ...document.snapshot,
      userId: "demo-user",
      userName: "Demo Parent",
      summaryNotes: ["One reminder was accepted."],
      memory: {
        ...createEmptyAgentMemory(),
        lastUpdatedAt: "2026-05-03T10:00:00.000Z"
      }
    };
    const markdown = serializeUserMemory(nextSnapshot, [
      {
        id: "event-1",
        type: "feedback",
        createdAt: "2026-05-03T10:00:00.000Z",
        title: "Feedback recorded",
        summary: "Accepted reminder focus recommendation.",
        payload: { verdict: "accepted" }
      }
    ]);
    const reparsed = parseUserMemory(markdown);

    expect(reparsed.snapshot.userId).toBe("demo-user");
    expect(reparsed.snapshot.summaryNotes).toEqual(["One reminder was accepted."]);
    expect(reparsed.events).toHaveLength(1);
    expect(reparsed.events[0].title).toBe("Feedback recorded");
  });
});
