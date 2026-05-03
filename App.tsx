import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Updates from "expo-updates";
import { copyByLocale, detectInitialLocale, type Locale, type TabKey } from "./src/i18n";

const palette = {
  page: "#f6efe7",
  pageAlt: "#f1e5d7",
  ink: "#172126",
  muted: "#5e666b",
  line: "#d9c7b2",
  card: "#fffaf4",
  accent: "#d56e4b",
  accentDeep: "#a84c31",
  teal: "#7ea6a1",
  sage: "#a9bb8f",
  plum: "#6f5d79",
  sky: "#c8d9de",
  cream: "#f4d9bb"
};

export default function App() {
  const [locale, setLocale] = useState<Locale>(detectInitialLocale);
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "checking" | "downloading" | "applying" | "unavailableDev" | "unavailableConfig" | "upToDate" | "readyToReload" | "failed"
  >("idle");
  const copy = copyByLocale[locale];

  const activeHeadline = useMemo(() => {
    return copy.activeHeadline[activeTab];
  }, [activeTab, copy]);

  const tabLabels: { key: TabKey; label: string }[] = [
    { key: "today", label: copy.tabs.today },
    { key: "planner", label: copy.tabs.planner },
    { key: "outings", label: copy.tabs.outings },
    { key: "family", label: copy.tabs.family }
  ];

  async function handleCheckForUpdates() {
    if (isUpdating) {
      return;
    }

    if (__DEV__) {
      setUpdateStatus("unavailableDev");
      return;
    }

    if (!Updates.isEnabled) {
      setUpdateStatus("unavailableConfig");
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateStatus("checking");

      const result = await Updates.checkForUpdateAsync();

      if (!result.isAvailable) {
        setUpdateStatus("upToDate");
        return;
      }

      setUpdateStatus("downloading");
      await Updates.fetchUpdateAsync();

      setUpdateStatus("readyToReload");
      setUpdateStatus("applying");
      await Updates.reloadAsync();
    } catch {
      setUpdateStatus("failed");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[palette.cream, palette.page]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{copy.heroBadge}</Text>
            </View>
            <View style={styles.localeSwitcher}>
              <Text style={styles.localeLabel}>{copy.languageLabel}</Text>
              <View style={styles.localeOptions}>
                {(Object.keys(copy.languageOptions) as Locale[]).map((option) => {
                  const active = option === locale;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setLocale(option)}
                      style={[styles.localePill, active && styles.localePillActive]}
                    >
                      <Text style={[styles.localePillText, active && styles.localePillTextActive]}>
                        {copy.languageOptions[option]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          <Text style={styles.heroTitle}>{copy.heroTitle}</Text>
          <Text style={styles.heroCopy}>{copy.heroCopy}</Text>
          <View style={styles.snapshotRow}>
            {copy.metrics.map((metric) => (
              <Metric key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </View>
          <View style={styles.updateCard}>
            <TouchableOpacity
              onPress={handleCheckForUpdates}
              style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fffaf4" size="small" />
              ) : (
                <Text style={styles.updateButtonText}>{copy.update.button}</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.updateHint}>{copy.update[updateStatus]}</Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>{copy.sectionEyebrow}</Text>
          <Text style={styles.sectionTitle}>{activeHeadline}</Text>
        </View>

        <View style={styles.tabBar}>
          {tabLabels.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === "today" && <TodayTab locale={locale} />}
        {activeTab === "planner" && <PlannerTab locale={locale} />}
        {activeTab === "outings" && <OutingsTab locale={locale} />}
        {activeTab === "family" && <FamilyTab locale={locale} />}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>{copy.footerTitle}</Text>
          <Text style={styles.footerCopy}>{copy.footerCopy}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TodayTab({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  return (
    <View style={styles.stack}>
      {copy.todayCards.map((card) => (
        <View key={card.title} style={[styles.infoCard, toneStyle[card.tone]]}>
          <Text style={styles.cardEyebrow}>{card.eyebrow}</Text>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.cardCopy}>{card.description}</Text>
        </View>
      ))}
    </View>
  );
}

function PlannerTab({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  return (
    <View style={styles.stack}>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>{copy.weeklyPlanTitle}</Text>
        {copy.weeklyPlan.map((item) => (
          <View key={item.day} style={styles.timelineRow}>
            <Text style={styles.timelineDay}>{item.day}</Text>
            <View style={styles.timelineBody}>
              <Text style={styles.timelineTitle}>{item.title}</Text>
              <Text style={styles.timelineCopy}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.highlightStrip}>
        <Text style={styles.highlightText}>{copy.weeklyNextAction}</Text>
      </View>
    </View>
  );
}

function OutingsTab({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  return (
    <View style={styles.stack}>
      <View style={styles.weatherCard}>
        <Text style={styles.cardEyebrow}>{copy.outingEyebrow}</Text>
        <Text style={styles.cardTitle}>{copy.outingTitle}</Text>
        <Text style={styles.cardCopy}>{copy.outingCopy}</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>{copy.packListTitle}</Text>
        {copy.outingChecklist.map((item) => (
          <View key={item} style={styles.checkRow}>
            <View style={styles.checkDot} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FamilyTab({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  return (
    <View style={styles.stack}>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>{copy.familyTitle}</Text>
        {copy.familyFeed.map((item) => (
          <View key={item.role} style={styles.familyRow}>
            <View>
              <Text style={styles.familyRole}>{item.role}</Text>
              <Text style={styles.familyTask}>{item.task}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.familyNote}>
        <Text style={styles.familyNoteText}>{copy.familyNote}</Text>
      </View>
    </View>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const toneStyle = StyleSheet.create({
  urgent: {
    borderLeftColor: palette.accent,
    backgroundColor: "#fff0eb"
  },
  calm: {
    borderLeftColor: palette.sage,
    backgroundColor: "#f7f6ea"
  },
  info: {
    borderLeftColor: palette.teal,
    backgroundColor: "#eef5f4"
  }
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.page
  },
  page: {
    flex: 1
  },
  content: {
    padding: 18,
    paddingBottom: 36,
    gap: 18
  },
  hero: {
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(23,33,38,0.08)",
    overflow: "hidden",
    gap: 14
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,250,244,0.9)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(23,33,38,0.08)"
  },
  heroBadgeText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  localeSwitcher: {
    alignItems: "flex-end",
    gap: 6
  },
  localeLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  localeOptions: {
    flexDirection: "row",
    gap: 8
  },
  localePill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(23,33,38,0.12)",
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  localePillActive: {
    backgroundColor: palette.ink,
    borderColor: palette.ink
  },
  localePillText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "700"
  },
  localePillTextActive: {
    color: "#fffaf4"
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800"
  },
  heroCopy: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 23
  },
  updateCard: {
    gap: 10,
    marginTop: 4
  },
  updateButton: {
    alignSelf: "flex-start",
    minWidth: 158,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: palette.accentDeep,
    alignItems: "center",
    justifyContent: "center"
  },
  updateButtonDisabled: {
    opacity: 0.82
  },
  updateButtonText: {
    color: "#fffaf4",
    fontSize: 14,
    fontWeight: "800"
  },
  updateHint: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 320
  },
  snapshotRow: {
    flexDirection: "row",
    gap: 12
  },
  metric: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.68)",
    padding: 14,
    borderRadius: 22
  },
  metricValue: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: "800"
  },
  metricLabel: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 3
  },
  sectionHeader: {
    gap: 4,
    marginTop: 2
  },
  sectionEyebrow: {
    color: palette.accentDeep,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800"
  },
  tabBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: "rgba(255,255,255,0.45)"
  },
  tabActive: {
    backgroundColor: palette.ink,
    borderColor: palette.ink
  },
  tabLabel: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "700"
  },
  tabLabelActive: {
    color: "#fffaf4"
  },
  stack: {
    gap: 14
  },
  infoCard: {
    borderRadius: 24,
    padding: 18,
    borderLeftWidth: 6
  },
  cardEyebrow: {
    color: palette.accentDeep,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.35,
    marginBottom: 8
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    marginBottom: 8
  },
  cardCopy: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 22
  },
  panel: {
    backgroundColor: palette.card,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 14
  },
  panelTitle: {
    color: palette.ink,
    fontSize: 19,
    fontWeight: "800"
  },
  timelineRow: {
    flexDirection: "row",
    gap: 14
  },
  timelineDay: {
    width: 42,
    color: palette.accentDeep,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2
  },
  timelineBody: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(217,199,178,0.6)"
  },
  timelineTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4
  },
  timelineCopy: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21
  },
  highlightStrip: {
    backgroundColor: palette.plum,
    borderRadius: 22,
    padding: 16
  },
  highlightText: {
    color: "#f9f5f1",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600"
  },
  weatherCard: {
    backgroundColor: palette.sky,
    borderRadius: 26,
    padding: 18
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: palette.accent
  },
  checkText: {
    flex: 1,
    color: palette.ink,
    fontSize: 15,
    lineHeight: 20
  },
  familyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(217,199,178,0.6)"
  },
  familyRole: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  familyTask: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    maxWidth: 220
  },
  statusPill: {
    backgroundColor: palette.pageAlt,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  statusText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "700"
  },
  familyNote: {
    backgroundColor: "#f3eadf",
    borderRadius: 22,
    padding: 16
  },
  familyNoteText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21
  },
  footerCard: {
    marginTop: 4,
    backgroundColor: "#f0e4d5",
    borderRadius: 24,
    padding: 18
  },
  footerTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8
  },
  footerCopy: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21
  }
});
