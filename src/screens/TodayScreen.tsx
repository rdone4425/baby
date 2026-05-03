import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AgentRecommendationCard } from "../components/AgentRecommendationCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Copy } from "../i18n/types";
import { AgentFeedbackVerdict, AgentRecommendation } from "../types/agent";
import { BabyProfile, FeedingMode, Locale } from "../types/domain";
import { palette } from "../theme/tokens";
import { formatDate, getAgeInMonths } from "../utils/date";

type Props = {
  copy: Copy;
  locale: Locale;
  babyProfile: BabyProfile | null;
  recommendations: AgentRecommendation[];
  mode: "mock" | "supabase";
  saveBabyProfile: (input: { name: string; birthDate: string; feedingMode: FeedingMode; notes: string }) => Promise<void>;
  onRequestMagicLink: (email: string) => Promise<void>;
  onFeedback: (recommendation: AgentRecommendation, verdict: AgentFeedbackVerdict) => Promise<void>;
  onRefreshAgent: () => Promise<void>;
  isAgentRunning: boolean;
};

export function TodayScreen({
  copy,
  locale,
  babyProfile,
  recommendations,
  mode,
  saveBabyProfile,
  onRequestMagicLink,
  onFeedback,
  onRefreshAgent,
  isAgentRunning
}: Props) {
  const [name, setName] = useState(babyProfile?.name ?? "");
  const [birthDate, setBirthDate] = useState(babyProfile?.birthDate ?? "");
  const [feedingMode, setFeedingMode] = useState<FeedingMode>(babyProfile?.feedingMode ?? "mixed");
  const [notes, setNotes] = useState(babyProfile?.notes ?? "");
  const [email, setEmail] = useState("");

  const profileMeta = useMemo(() => {
    if (!babyProfile) {
      return null;
    }

    const months = getAgeInMonths(babyProfile.birthDate);
    return locale === "zh"
      ? `${formatDate(babyProfile.birthDate, locale)} · ${months} 个月`
      : `${formatDate(babyProfile.birthDate, locale)} · ${months} months`;
  }, [babyProfile, locale]);

  return (
    <View style={styles.stack}>
      <Card tone={mode === "mock" ? "calm" : "info"}>
        <Text style={styles.cardTitle}>{mode === "mock" ? copy.appMode.mockTitle : copy.appMode.remoteTitle}</Text>
        <Text style={styles.cardBody}>{mode === "mock" ? copy.appMode.mockBody : copy.appMode.remoteBody}</Text>
        <Field
          label={copy.auth.title}
          value={email}
          onChangeText={setEmail}
          placeholder={copy.generic.emailPlaceholder}
        />
        <Button label={copy.auth.sendMagicLink} variant="secondary" onPress={() => onRequestMagicLink(email)} />
      </Card>

      <Card tone="default">
        <Text style={styles.cardTitle}>{copy.profile.title}</Text>
        {babyProfile ? (
          <View style={styles.profileSummary}>
            <Text style={styles.profileName}>{babyProfile.name}</Text>
            <Text style={styles.cardBody}>{profileMeta}</Text>
            <Text style={styles.cardBody}>{copy.profile.feedingModes[babyProfile.feedingMode]}</Text>
            {babyProfile.notes ? <Text style={styles.cardBody}>{babyProfile.notes}</Text> : null}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.cardTitle}>{copy.profile.emptyTitle}</Text>
            <Text style={styles.cardBody}>{copy.profile.emptyBody}</Text>
          </View>
        )}

        <Field label={copy.profile.name} value={name} onChangeText={setName} />
        <Field label={copy.profile.birthDate} value={birthDate} onChangeText={setBirthDate} />
        <View style={styles.pillRow}>
          {(Object.keys(copy.profile.feedingModes) as FeedingMode[]).map((option) => {
            const active = option === feedingMode;
            return (
              <Button
                key={option}
                label={copy.profile.feedingModes[option]}
                variant={active ? "primary" : "secondary"}
                onPress={() => setFeedingMode(option)}
              />
            );
          })}
        </View>
        <Field label={copy.profile.notes} value={notes} onChangeText={setNotes} multiline />
        <Button label={copy.profile.save} onPress={() => saveBabyProfile({ name, birthDate, feedingMode, notes })} />
      </Card>

      <View style={styles.agentHeader}>
        <View style={styles.agentHeaderText}>
          <Text style={styles.sectionTitle}>{copy.agent.title}</Text>
          <Text style={styles.cardBody}>{copy.agent.memoryHint}</Text>
        </View>
        <Button label={copy.agent.refresh} onPress={onRefreshAgent} disabled={isAgentRunning} />
      </View>

      <View style={styles.stack}>
        {recommendations.length === 0 ? (
          <Card>
            <Text style={styles.cardBody}>{copy.agent.noRecommendations}</Text>
          </Card>
        ) : (
          recommendations.map((recommendation) => (
            <AgentRecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              labels={{
                accept: copy.agent.accept,
                ignore: copy.agent.ignore,
                notRelevant: copy.agent.notRelevant,
                showReason: copy.agent.showReason,
                hideReason: copy.agent.hideReason,
                reasonTitle: copy.agent.reasonTitle,
                sourceTitle: copy.agent.sourceTitle
              }}
              onFeedback={(verdict) => onFeedback(recommendation, verdict)}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  cardBody: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21
  },
  profileSummary: {
    gap: 6
  },
  profileName: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "800"
  },
  emptyState: {
    gap: 6
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "800"
  },
  agentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  agentHeaderText: {
    flex: 1,
    gap: 4
  }
});
