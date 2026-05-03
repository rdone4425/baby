import AsyncStorage from "@react-native-async-storage/async-storage";
import { en } from "./messages/en";
import { es } from "./messages/es";
import { ja } from "./messages/ja";
import { zh } from "./messages/zh";
import { Locale } from "../types/domain";

export const copyByLocale = {
  en,
  zh,
  es,
  ja
};

const LOCALE_STORAGE_KEY = "baby-agent-mobile/preferences/locale";

export function detectInitialLocale(): Locale {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
  if (locale.startsWith("ja")) {
    return "ja";
  }
  if (locale.startsWith("es")) {
    return "es";
  }
  return locale.startsWith("zh") ? "zh" : "en";
}

export async function loadStoredLocale() {
  const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "zh" || stored === "en" || stored === "es" || stored === "ja" ? stored : null;
}

export async function savePreferredLocale(locale: Locale) {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
