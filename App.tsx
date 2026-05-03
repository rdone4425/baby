import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { buildAgentObservation } from "./src/agent/buildObservation";
import { createEmptyAgentMemory } from "./src/agent/memory";
import { SectionHeader } from "./src/components/SectionHeader";
import { TabBar } from "./src/components/TabBar";
import { copyByLocale, detectInitialLocale } from "./src/i18n";
import { createAppRepository } from "./src/services/api";
import { AppRepository } from "./src/services/api/types";
import { FamilyScreen } from "./src/screens/FamilyScreen";
import { OutingsScreen } from "./src/screens/OutingsScreen";
import { PlannerScreen } from "./src/screens/PlannerScreen";
import { TodayScreen } from "./src/screens/TodayScreen";
import { palette, radius } from "./src/theme/tokens";
import { AgentFeedbackVerdict, AgentMemory, AgentRecommendation, AgentRun, AgentTrigger } from "./src/types/agent";
import {
  Appointment,
  DashboardData,
  FamilyTask,
  FeedingMode,
  Locale,
  OutingChecklistItem,
  OutingScenario,
  Reminder,
  TabKey
} from "./src/types/domain";
import { LoadState } from "./src/types/service";
import { buildOutingChecklist, deriveNextAction, deriveWeeklyPlan } from "./src/features/dashboard/deriveDashboard";
import { createId } from "./src/utils/id";

const repository: AppRepository = createAppRepository();

type UpdateStatus =
  | "idle"
  | "checking"
  | "downloading"
  | "applying"
  | "unavailableDev"
  | "unavailableConfig"
  | "upToDate"
  | "failed";

const emptyDashboard: DashboardData = {
  user: {
    id: "unknown",
    email: "",
    name: ""
  },
  mode: repository.mode,
  babyProfile: null,
  appointments: [],
  reminders: [],
  familyTasks: [],
  todayItems: []
};

export default function App() {
  const [locale, setLocale] = useState<Locale>(detectInitialLocale);
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
  const [weeklyPlan, setWeeklyPlan] = useState(deriveWeeklyPlan(locale, [], [], []));
  const [outingScenario, setOutingScenario] = useState<OutingScenario>("clinic");
  const [outingChecklist, setOutingChecklist] = useState<OutingChecklistItem[]>(
    buildOutingChecklist(locale, "clinic", null)
  );
  const [agentMemory, setAgentMemory] = useState<AgentMemory>(createEmptyAgentMemory());
  const [latestAgentRun, setLatestAgentRun] = useState<AgentRun | null>(null);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");

  const copy = copyByLocale[locale];
  const todayRecommendations = useMemo(
    () => latestAgentRun?.recommendations.filter((item) => item.surface === "today") ?? [],
    [latestAgentRun]
  );
  const plannerRecommendations = useMemo(
    () => latestAgentRun?.recommendations.filter((item) => item.surface === "planner") ?? [],
    [latestAgentRun]
  );
  const outingsRecommendation = useMemo(
    () => latestAgentRun?.recommendations.find((item) => item.surface === "outings") ?? null,
    [latestAgentRun]
  );
  const familyRecommendation = useMemo(
    () => latestAgentRun?.recommendations.find((item) => item.surface === "family") ?? null,
    [latestAgentRun]
  );

  useEffect(() => {
    void refresh("app_load");
  }, []);

  useEffect(() => {
    setWeeklyPlan(deriveWeeklyPlan(locale, dashboard.appointments, dashboard.reminders, dashboard.familyTasks));
    setOutingChecklist(buildOutingChecklist(locale, outingScenario, dashboard.babyProfile));
  }, [dashboard, locale, outingScenario]);

  useEffect(() => {
    if (dashboard.user.id === "unknown") {
      return;
    }

    const timeout = setTimeout(() => {
      void runAgent("manual_refresh", dashboard);
    }, 250);

    return () => clearTimeout(timeout);
  }, [locale]);

  async function syncAgentState() {
    const stateResult = await repository.getAgentState();
    if (stateResult.ok && stateResult.data) {
      setAgentMemory(stateResult.data.memory);
      setLatestAgentRun(stateResult.data.latestRun);
    }
  }

  async function runAgent(trigger: AgentTrigger, dashboardInput: DashboardData) {
    setIsAgentRunning(true);
    const result = await repository.runAgent(buildAgentObservation(dashboardInput, locale, outingScenario, trigger));
    if (result.ok && result.data) {
      setLatestAgentRun(result.data);
    }
    await syncAgentState();
    setIsAgentRunning(false);
  }

  async function refresh(trigger: AgentTrigger) {
    setLoadState("loading");
    setError(null);
    const result = await repository.getDashboardData();
    if (!result.ok || !result.data) {
      setLoadState("error");
      setError(result.error ?? "Unable to load dashboard.");
      return;
    }

    const normalized = {
      ...result.data
    };
    setDashboard(normalized);
    setLoadState(
      normalized.babyProfile || normalized.appointments.length || normalized.familyTasks.length || normalized.reminders.length
        ? "success"
        : "empty"
    );
    await runAgent(trigger, normalized);
  }

  async function handleSaveBabyProfile(input: {
    name: string;
    birthDate: string;
    feedingMode: FeedingMode;
    notes: string;
  }) {
    const result = await repository.saveBabyProfile(input);
    if (!result.ok) {
      Alert.alert(copy.generic.saveFailed, result.error);
      return;
    }
    Alert.alert(copy.generic.saveSucceeded);
    await refresh("profile_saved");
  }

  async function handleSaveAppointment(input: Omit<Appointment, "id" | "userId" | "babyId" | "category">) {
    const result = await repository.saveAppointment({ ...input, category: "checkup" });
    if (!result.ok) {
      Alert.alert(copy.generic.saveFailed, result.error);
      return;
    }
    await recordImplicitFeedback("appointment_focus", "Appointment created after suggestion.");
    await refresh("appointment_saved");
  }

  async function handleSaveReminder(input: Omit<Reminder, "id" | "userId" | "babyId" | "status" | "source">) {
    const result = await repository.saveReminder(input);
    if (!result.ok) {
      Alert.alert(copy.generic.saveFailed, result.error);
      return;
    }
    await recordImplicitFeedback("reminder_focus", "Reminder created after suggestion.");
    await refresh("reminder_saved");
  }

  async function handleSaveFamilyTask(input: Omit<FamilyTask, "id" | "userId" | "babyId" | "status">) {
    const result = await repository.saveFamilyTask(input);
    if (!result.ok) {
      Alert.alert(copy.generic.saveFailed, result.error);
      return;
    }
    await recordImplicitFeedback("family_handoff", "Family task created after suggestion.", input.assigneeName);
    await refresh("family_task_saved");
  }

  async function handleScenarioChange(scenario: OutingScenario) {
    setOutingScenario(scenario);
    const result = await repository.getOutingChecklist({ scenario, babyProfile: dashboard.babyProfile, locale });
    if (result.ok && result.data) {
      setOutingChecklist(result.data);
    } else {
      setOutingChecklist(buildOutingChecklist(locale, scenario, dashboard.babyProfile));
    }
    await recordImplicitFeedback("outing_prep", "Scenario changed and checklist re-used.", undefined, scenario);
    if (dashboard.user.id !== "unknown") {
      await runAgent("outing_scenario_changed", dashboard);
    }
  }

  async function handleRequestMagicLink(email: string) {
    const result = await repository.requestMagicLink(email);
    if (!result.ok) {
      Alert.alert(copy.generic.errorPrefix, result.error ?? copy.generic.magicLinkUnavailable);
      return;
    }
    Alert.alert(copy.generic.saveSucceeded);
  }

  async function recordImplicitFeedback(
    kind: AgentRecommendation["kind"],
    note: string,
    assigneeName?: string,
    scenario?: OutingScenario
  ) {
    const recommendation = latestAgentRun?.recommendations.find((item) => item.kind === kind);
    if (!recommendation) {
      return;
    }

    await repository.saveAgentFeedback({
      id: createId("agent-feedback"),
      recommendationId: recommendation.id,
      recommendationKind: recommendation.kind,
      verdict: "implicit_accept",
      channel: "implicit",
      appliedAt: new Date().toISOString(),
      note,
      assigneeName: assigneeName ?? recommendation.metadata?.assigneeName,
      outingScenario: scenario ?? (recommendation.metadata?.outingScenario as OutingScenario | undefined)
    });
    await syncAgentState();
  }

  async function handleRecommendationFeedback(recommendation: AgentRecommendation, verdict: AgentFeedbackVerdict) {
    await repository.saveAgentFeedback({
      id: createId("agent-feedback"),
      recommendationId: recommendation.id,
      recommendationKind: recommendation.kind,
      verdict,
      channel: "explicit",
      appliedAt: new Date().toISOString(),
      note: `${verdict} from Today surface`,
      assigneeName: recommendation.metadata?.assigneeName,
      outingScenario: recommendation.metadata?.outingScenario as OutingScenario | undefined
    });
    await syncAgentState();
    await runAgent("manual_refresh", dashboard);
  }

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
      setUpdateStatus("applying");
      await Updates.reloadAsync();
    } catch {
      setUpdateStatus("failed");
    } finally {
      setIsUpdating(false);
    }
  }

  const nextAction = useMemo(() => deriveNextAction(locale, dashboard.reminders), [dashboard.reminders, locale]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <LinearGradient colors={[palette.cream, palette.page]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
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
          <TouchableOpacity
            onPress={handleCheckForUpdates}
            style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
            disabled={isUpdating}
          >
            {isUpdating ? <ActivityIndicator color={palette.surface} /> : <Text style={styles.updateButtonText}>{copy.updateButton}</Text>}
          </TouchableOpacity>
          <Text style={styles.updateHint}>{copy.updateStatus[updateStatus]}</Text>
        </LinearGradient>

        <SectionHeader eyebrow={copy.screenEyebrows[activeTab]} title={copy.tabLabels[activeTab]} />
        <TabBar activeTab={activeTab} labels={copy.tabLabels} onChange={setActiveTab} />

        {loadState === "loading" ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={palette.accentDeep} />
            <Text style={styles.loadingText}>{copy.generic.loading}</Text>
          </View>
        ) : null}

        {loadState === "error" ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>{copy.generic.errorPrefix}</Text>
            <Text style={styles.errorBody}>{error}</Text>
            <TouchableOpacity onPress={() => void refresh("manual_refresh")} style={styles.retryButton}>
              <Text style={styles.retryText}>{copy.generic.retry}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {loadState !== "loading" && loadState !== "error" ? (
          <>
            {activeTab === "today" ? (
              <TodayScreen
                copy={copy}
                locale={locale}
                babyProfile={dashboard.babyProfile}
                recommendations={todayRecommendations}
                mode={dashboard.mode}
                saveBabyProfile={handleSaveBabyProfile}
                onRequestMagicLink={handleRequestMagicLink}
                onFeedback={handleRecommendationFeedback}
                onRefreshAgent={() => refresh("manual_refresh")}
                isAgentRunning={isAgentRunning}
              />
            ) : null}
            {activeTab === "planner" ? (
              <PlannerScreen
                copy={copy}
                locale={locale}
                weeklyPlan={weeklyPlan}
                reminders={dashboard.reminders}
                nextAction={plannerRecommendations[0]?.description || nextAction}
                recommendations={plannerRecommendations}
                onSaveAppointment={handleSaveAppointment}
                onSaveReminder={handleSaveReminder}
                onRefreshAgent={() => refresh("manual_refresh")}
                isAgentRunning={isAgentRunning}
              />
            ) : null}
            {activeTab === "outings" ? (
              <OutingsScreen
                copy={copy}
                babyProfile={dashboard.babyProfile}
                scenario={outingScenario}
                checklist={outingChecklist}
                locale={locale}
                recommendation={outingsRecommendation}
                onScenarioChange={handleScenarioChange}
              />
            ) : null}
            {activeTab === "family" ? (
              <FamilyScreen
                copy={copy}
                locale={locale}
                tasks={dashboard.familyTasks}
                recommendation={familyRecommendation}
                onSaveTask={handleSaveFamilyTask}
              />
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

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
    borderRadius: radius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(23,33,38,0.08)",
    gap: 12
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  heroBadge: {
    backgroundColor: "rgba(255,250,244,0.9)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
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
    color: palette.surface
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
  updateButton: {
    alignSelf: "flex-start",
    minWidth: 168,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: palette.accentDeep,
    alignItems: "center",
    justifyContent: "center"
  },
  updateButtonDisabled: {
    opacity: 0.75
  },
  updateButtonText: {
    color: palette.surface,
    fontWeight: "800",
    fontSize: 14
  },
  updateHint: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20
  },
  loadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14
  },
  errorCard: {
    backgroundColor: palette.dangerSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.accent,
    padding: 16,
    gap: 8
  },
  errorTitle: {
    color: palette.ink,
    fontWeight: "800",
    fontSize: 16
  },
  errorBody: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: palette.accentDeep
  },
  retryText: {
    color: palette.surface,
    fontWeight: "800"
  }
});
