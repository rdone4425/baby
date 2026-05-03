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
import { buildAgentObservation } from "./src/agent/buildObservation";
import { createEmptyAgentMemory } from "./src/agent/memory";
import { LocationGate, LocationDraft } from "./src/components/LocationGate";
import { SectionHeader } from "./src/components/SectionHeader";
import { TabBar } from "./src/components/TabBar";
import { copyByLocale, detectInitialLocale, loadStoredLocale, savePreferredLocale } from "./src/i18n";
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
import { saveUserMemoryLocation } from "./src/storage/agentDocuments";
import { createId } from "./src/utils/id";

const repository: AppRepository = createAppRepository();

const emptyDashboard: DashboardData = {
  user: {
    id: "unknown",
    email: "",
    name: "",
    country: "",
    region: "",
    street: ""
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
  const [locationDraft, setLocationDraft] = useState<LocationDraft>({
    country: "",
    region: "",
    street: ""
  });
  const [locationConfirmed, setLocationConfirmed] = useState(false);

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
    void (async () => {
      const storedLocale = await loadStoredLocale();
      if (storedLocale) {
        setLocale(storedLocale);
      }
    })();
  }, []);

  useEffect(() => {
    setWeeklyPlan(deriveWeeklyPlan(locale, dashboard.appointments, dashboard.reminders, dashboard.familyTasks));
    setOutingChecklist(buildOutingChecklist(locale, outingScenario, dashboard.babyProfile));
  }, [dashboard, locale, outingScenario]);

  useEffect(() => {
    if (!dashboard.babyProfile) {
      return;
    }

    const nextDraft = {
      country: dashboard.babyProfile.country,
      region: dashboard.babyProfile.region,
      street: dashboard.babyProfile.street
    };
    setLocationDraft(nextDraft);
    if (nextDraft.country && nextDraft.region && nextDraft.street) {
      setLocationConfirmed(true);
    }
  }, [dashboard.babyProfile]);

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
    country: string;
    region: string;
    street: string;
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

  async function handleConfirmLocation(value: LocationDraft) {
    setLocationDraft(value);
    setLocationConfirmed(true);
    await repository.saveUserLocation(value);
    await saveUserMemoryLocation({ ...value, preferredLocale: locale });
  }

  async function handleLocaleChange(nextLocale: Locale) {
    setLocale(nextLocale);
    await savePreferredLocale(nextLocale);
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

  const nextAction = useMemo(() => deriveNextAction(locale, dashboard.reminders), [dashboard.reminders, locale]);
  const needsLocationGate = !locationConfirmed && !dashboard.babyProfile?.country;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        {!needsLocationGate ? (
          <View style={styles.localeBar}>
            <Text style={styles.localeLabel}>{copy.languageLabel}</Text>
            <View style={styles.localeOptions}>
              {(Object.keys(copy.languageOptions) as Locale[]).map((option) => {
                const active = option === locale;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => void handleLocaleChange(option)}
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
        ) : null}

        {!needsLocationGate ? (
          <>
            <SectionHeader eyebrow={copy.screenEyebrows[activeTab]} title={copy.tabLabels[activeTab]} />
            <TabBar activeTab={activeTab} labels={copy.tabLabels} onChange={setActiveTab} />
          </>
        ) : null}

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
            {needsLocationGate ? (
              <LocationGate
                copy={copy}
                locale={locale}
                initialValue={locationDraft}
                onLocaleChange={(nextLocale) => void handleLocaleChange(nextLocale)}
                onConfirm={(value) => void handleConfirmLocation(value)}
              />
            ) : null}
            {!needsLocationGate && activeTab === "today" ? (
              <TodayScreen
                copy={copy}
                locale={locale}
                babyProfile={dashboard.babyProfile}
                recommendations={todayRecommendations}
                locationDraft={locationDraft}
                saveBabyProfile={handleSaveBabyProfile}
                onFeedback={handleRecommendationFeedback}
                onRefreshAgent={() => refresh("manual_refresh")}
                isAgentRunning={isAgentRunning}
              />
            ) : null}
            {!needsLocationGate && activeTab === "planner" ? (
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
            {!needsLocationGate && activeTab === "outings" ? (
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
            {!needsLocationGate && activeTab === "family" ? (
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 18
  },
  localeBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingBottom: 4,
    maxWidth: 440,
    width: "100%",
    alignSelf: "center"
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
