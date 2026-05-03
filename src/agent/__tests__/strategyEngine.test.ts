import { runRuleBasedStrategy } from "../strategyEngine";
import { createEmptyAgentMemory } from "../memory";
import type { AgentObservation } from "../../types/agent";

function buildObservation(overrides: Partial<AgentObservation> = {}): AgentObservation {
  return {
    userId: "user-1",
    locale: "en",
    trigger: "app_load",
    occurredAt: "2026-05-03T00:00:00.000Z",
    outingScenario: "clinic",
    babyProfile: null,
    appointments: [],
    reminders: [],
    familyTasks: [],
    ...overrides
  };
}

describe("runRuleBasedStrategy", () => {
  describe("when babyProfile is null", () => {
    const memory = createEmptyAgentMemory();
    const observation = buildObservation();
    const recommendations = runRuleBasedStrategy(observation, memory);

    it("returns at least one recommendation", () => {
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it("includes an onboarding recommendation on the today surface", () => {
      const onboarding = recommendations.find((r) => r.kind === "onboarding");
      expect(onboarding).toBeDefined();
      expect(onboarding?.surface).toBe("today");
    });

    it("does NOT include stage_guidance (requires babyProfile)", () => {
      const stage = recommendations.find((r) => r.kind === "stage_guidance");
      expect(stage).toBeUndefined();
    });

    it("orders recommendations by descending score (highest priority first)", () => {
      const onboarding = recommendations.find((r) => r.kind === "onboarding");
      const outingPrep = recommendations.find((r) => r.kind === "outing_prep");
      // Onboarding has higher base score (2) than outing_prep (1.3), and there's no profile
      // so it's the urgent rec. It should appear before outing_prep in sorted output.
      expect(recommendations.indexOf(onboarding!)).toBeLessThan(recommendations.indexOf(outingPrep!));
    });

    it("clamps confidence to [0.2, 0.98]", () => {
      for (const r of recommendations) {
        expect(r.confidence).toBeGreaterThanOrEqual(0.2);
        expect(r.confidence).toBeLessThanOrEqual(0.98);
      }
    });
  });
});
