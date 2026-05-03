import { createMockRepository } from "./mockRepository";
import { createSupabaseRepository, isSupabaseConfigured } from "./supabaseRepository";

export function createAppRepository() {
  if (isSupabaseConfigured()) {
    return createSupabaseRepository();
  }

  return createMockRepository();
}
