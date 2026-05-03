import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type TabKey = "today" | "planner" | "outings" | "family";

type TodayCard = {
  eyebrow: string;
  title: string;
  description: string;
  tone: "urgent" | "calm" | "info";
};

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

const todayCards: TodayCard[] = [
  {
    eyebrow: "This morning",
    title: "6-month vaccine visit tomorrow",
    description: "Pack the immunization card, spare outfit, and bottle before 9 PM tonight.",
    tone: "urgent"
  },
  {
    eyebrow: "Age signal",
    title: "Solid food week starts now",
    description: "Focus on one iron-rich food this week and log reactions for clarity, not perfection.",
    tone: "calm"
  },
  {
    eyebrow: "Weather-aware",
    title: "Windy afternoon stroller plan",
    description: "Use one extra light layer and keep the outing under 45 minutes after the appointment.",
    tone: "info"
  }
];

const weeklyPlan = [
  {
    day: "Mon",
    title: "Pediatrician prep",
    detail: "Confirm time, refill wipes pouch, and add questions about rash."
  },
  {
    day: "Wed",
    title: "Family sync",
    detail: "Grandma handles pickup kit, dad reviews bedtime supplies."
  },
  {
    day: "Fri",
    title: "Feeding checkpoint",
    detail: "Review first-food notes and generate next-week shopping list."
  }
];

const outingChecklist = [
  "Bottle or feeding backup",
  "Changing pouch",
  "One warm layer for transit",
  "Clinic card and insurance note",
  "Comfort toy for waiting room"
];

const familyFeed = [
  {
    role: "Mom",
    task: "Tracks feeding responses",
    status: "In progress"
  },
  {
    role: "Dad",
    task: "Owns tomorrow's appointment bag",
    status: "Ready"
  },
  {
    role: "Grandma",
    task: "Afternoon walk backup",
    status: "Needs update"
  }
];

const tabLabels: { key: TabKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "planner", label: "Planner" },
  { key: "outings", label: "Outings" },
  { key: "family", label: "Family" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");

  const activeHeadline = useMemo(() => {
    switch (activeTab) {
      case "today":
        return "What matters now";
      case "planner":
        return "This week's rhythm";
      case "outings":
        return "Leave home with less chaos";
      case "family":
        return "Keep every caregiver aligned";
    }
  }, [activeTab]);

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
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Baby Weekly Companion</Text>
          </View>
          <Text style={styles.heroTitle}>A proactive baby planning app for new parents.</Text>
          <Text style={styles.heroCopy}>
            Weekly priorities, appointment prep, outing clarity, and family coordination in one calm mobile flow.
          </Text>
          <View style={styles.snapshotRow}>
            <Metric value="3" label="priority actions" />
            <Metric value="1" label="upcoming visit" />
            <Metric value="4" label="caregivers synced" />
          </View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>Agent view</Text>
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

        {activeTab === "today" && <TodayTab />}
        {activeTab === "planner" && <PlannerTab />}
        {activeTab === "outings" && <OutingsTab />}
        {activeTab === "family" && <FamilyTab />}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Product guardrails</Text>
          <Text style={styles.footerCopy}>
            This app helps parents organize next actions. It does not replace pediatricians or provide medical diagnosis.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TodayTab() {
  return (
    <View style={styles.stack}>
      {todayCards.map((card) => (
        <View key={card.title} style={[styles.infoCard, toneStyle[card.tone]]}>
          <Text style={styles.cardEyebrow}>{card.eyebrow}</Text>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.cardCopy}>{card.description}</Text>
        </View>
      ))}
    </View>
  );
}

function PlannerTab() {
  return (
    <View style={styles.stack}>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Weekly plan</Text>
        {weeklyPlan.map((item) => (
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
        <Text style={styles.highlightText}>
          Next best action: generate a Friday summary for both parents after the feeding checkpoint.
        </Text>
      </View>
    </View>
  );
}

function OutingsTab() {
  return (
    <View style={styles.stack}>
      <View style={styles.weatherCard}>
        <Text style={styles.cardEyebrow}>Context-aware outing guidance</Text>
        <Text style={styles.cardTitle}>59F, breezy, clinic visit at 3:30 PM</Text>
        <Text style={styles.cardCopy}>
          Keep the core warm, avoid overdressing, and optimize for a smooth wait-room handoff.
        </Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Pack list</Text>
        {outingChecklist.map((item) => (
          <View key={item} style={styles.checkRow}>
            <View style={styles.checkDot} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FamilyTab() {
  return (
    <View style={styles.stack}>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Caregiver coordination</Text>
        {familyFeed.map((item) => (
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
        <Text style={styles.familyNoteText}>
          Shared reminders and handoffs are where the family plan becomes subscription-worthy.
        </Text>
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
