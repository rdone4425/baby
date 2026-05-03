import { Appointment, BabyProfile, FamilyTask, Reminder } from "../../types/domain";

function normalizeText(value: string) {
  return value.trim();
}

export function mapBabyProfileInput(input: Omit<BabyProfile, "id" | "userId">) {
  return {
    ...input,
    country: normalizeText(input.country),
    region: normalizeText(input.region),
    street: normalizeText(input.street),
    name: normalizeText(input.name),
    birthDate: normalizeText(input.birthDate),
    notes: normalizeText(input.notes)
  };
}

export function mapAppointmentInput(input: Omit<Appointment, "id" | "userId" | "babyId">) {
  return {
    ...input,
    title: normalizeText(input.title),
    startsAt: normalizeText(input.startsAt),
    location: normalizeText(input.location),
    notes: normalizeText(input.notes)
  };
}

export function mapReminderInput(input: Omit<Reminder, "id" | "userId" | "babyId" | "status" | "source">) {
  return {
    ...input,
    title: normalizeText(input.title),
    dueAt: normalizeText(input.dueAt)
  };
}

export function mapFamilyTaskInput(input: Omit<FamilyTask, "id" | "userId" | "babyId" | "status">) {
  return {
    ...input,
    assigneeName: normalizeText(input.assigneeName),
    title: normalizeText(input.title),
    dueAt: normalizeText(input.dueAt)
  };
}
