import { en } from "./messages/en";
import { zh } from "./messages/zh";
import { Locale } from "../types/domain";

export const copyByLocale = {
  en,
  zh
};

export function detectInitialLocale(): Locale {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
  return locale.startsWith("zh") ? "zh" : "en";
}
