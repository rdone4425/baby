import { formatDate, getAgeInMonths, isValidIsoDate } from "../date";

describe("date utils", () => {
  it("rejects impossible calendar dates", () => {
    expect(isValidIsoDate("2026-02-30")).toBe(false);
    expect(isValidIsoDate("2026-13-01")).toBe(false);
    expect(isValidIsoDate("2026-12-01")).toBe(true);
  });

  it("does not throw when formatting invalid dates", () => {
    expect(formatDate("2026-02-30", "en")).toBe("2026-02-30");
    expect(getAgeInMonths("2026-02-30")).toBe(0);
  });
});
