import { createEmptyAgentMemory } from "../../agent/memory";
import { AppRepository } from "./types";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function createSupabaseRepository(): AppRepository {
  return {
    mode: "supabase",
    async getCurrentUser() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async saveUserLocation() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async requestMagicLink() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async getDashboardData() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async getAgentState() {
      return { ok: true, data: { memory: createEmptyAgentMemory(), latestRun: null } };
    },
    async getAgentHistory() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async runAgent() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async saveAgentFeedback() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async getWeeklyPlan() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async getOutingChecklist() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async getFamilyTasks() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async saveBabyProfile() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async saveAppointment() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async saveReminder() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    },
    async saveFamilyTask() {
      return { ok: false, error: "Supabase repository is not wired in this build yet." };
    }
  };
}
