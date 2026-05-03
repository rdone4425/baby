import { getNearbyVaccineStations } from "../vaccineStations";

const ANY_ADDRESS = {
  country: "JP",
  region: "Tokyo",
  street: "1-2-3"
};

describe("getNearbyVaccineStations (mock)", () => {
  it("returns at least three stations for every supported locale", () => {
    for (const locale of ["en", "zh", "es", "ja"] as const) {
      const stations = getNearbyVaccineStations(ANY_ADDRESS, locale);
      expect(stations.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("returns stations with stable, unique ids per locale", () => {
    for (const locale of ["en", "zh", "es", "ja"] as const) {
      const stations = getNearbyVaccineStations(ANY_ADDRESS, locale);
      const ids = stations.map((station) => station.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("returns localized names that differ across locales", () => {
    const en = getNearbyVaccineStations(ANY_ADDRESS, "en")[0].name;
    const zh = getNearbyVaccineStations(ANY_ADDRESS, "zh")[0].name;
    const ja = getNearbyVaccineStations(ANY_ADDRESS, "ja")[0].name;

    expect(en).not.toBe(zh);
    expect(en).not.toBe(ja);
    expect(zh).not.toBe(ja);
  });

  it("populates every station with name, address, distance, and hours", () => {
    const stations = getNearbyVaccineStations(ANY_ADDRESS, "en");

    for (const station of stations) {
      expect(station.name.length).toBeGreaterThan(0);
      expect(station.addressLine.length).toBeGreaterThan(0);
      expect(station.distanceLabel.length).toBeGreaterThan(0);
      expect(station.hours.length).toBeGreaterThan(0);
    }
  });
});
