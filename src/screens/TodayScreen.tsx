import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AgentRecommendationCard } from "../components/AgentRecommendationCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { LocationDraft } from "../components/LocationGate";
import { PanelHeader } from "../components/PanelHeader";
import { StatPill } from "../components/StatPill";
import { Copy } from "../i18n/types";
import { getNearbyVaccineStations } from "../services/api/mocks/vaccineStations";
import { AgentFeedbackVerdict, AgentRecommendation } from "../types/agent";
import { BabyProfile, FeedingMode, Locale } from "../types/domain";
import { palette, spacing } from "../theme/tokens";
import { formatDate, getAgeInMonths } from "../utils/date";

type Props = {
  copy: Copy;
  locale: Locale;
  babyProfile: BabyProfile | null;
  recommendations: AgentRecommendation[];
  locationDraft: LocationDraft;
  saveBabyProfile: (input: {
    country: string;
    region: string;
    street: string;
    name: string;
    birthDate: string;
    feedingMode: FeedingMode;
    notes: string;
  }) => Promise<void>;
  onFeedback: (recommendation: AgentRecommendation, verdict: AgentFeedbackVerdict) => Promise<void>;
  onRefreshAgent: () => Promise<void>;
  isAgentRunning: boolean;
};

export function TodayScreen({
  copy,
  locale,
  babyProfile,
  recommendations,
  locationDraft,
  saveBabyProfile,
  onFeedback,
  onRefreshAgent,
  isAgentRunning
}: Props) {
  const initialBirthParts = useMemo(() => {
    const [year = "", month = "", day = ""] = (babyProfile?.birthDate ?? "").split("-");
    return { year, month, day };
  }, [babyProfile?.birthDate]);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(!babyProfile);
  const [name, setName] = useState(babyProfile?.name ?? "");
  const [birthYear, setBirthYear] = useState(initialBirthParts.year);
  const [birthMonth, setBirthMonth] = useState(initialBirthParts.month);
  const [birthDay, setBirthDay] = useState(initialBirthParts.day);
  const [feedingMode, setFeedingMode] = useState<FeedingMode>(babyProfile?.feedingMode ?? "mixed");
  const [notes, setNotes] = useState(babyProfile?.notes ?? "");

  const profileMeta = useMemo(() => {
    if (!babyProfile) {
      return null;
    }

    const months = getAgeInMonths(babyProfile.birthDate);
    return locale === "zh"
      ? `${formatDate(babyProfile.birthDate, locale)} · ${months} 个月`
      : `${formatDate(babyProfile.birthDate, locale)} · ${months} months`;
  }, [babyProfile, locale]);

  const recommendationCount = `${recommendations.length}`;
  const composedBirthDate =
    birthYear.trim() && birthMonth.trim() && birthDay.trim()
      ? `${birthYear.trim()}-${birthMonth.trim().padStart(2, "0")}-${birthDay.trim().padStart(2, "0")}`
      : "";

  const effectiveAddress = useMemo(
    () => ({
      country: babyProfile?.country || locationDraft.country,
      region: babyProfile?.region || locationDraft.region,
      street: babyProfile?.street || locationDraft.street
    }),
    [babyProfile, locationDraft]
  );
  const vaccineStations = useMemo(
    () =>
      effectiveAddress.street
        ? getNearbyVaccineStations(effectiveAddress, locale)
        : [],
    [effectiveAddress, locale]
  );

  return (
    <View style={styles.stack}>
      <Card tone="default">
        <PanelHeader
          eyebrow="Profile"
          title={copy.profile.title}
          description={babyProfile ? copy.agent.memoryHint : copy.profile.emptyBody}
          action={
            babyProfile && !isProfileSettingsOpen ? (
              <Button label={copy.profile.edit} variant="secondary" onPress={() => setIsProfileSettingsOpen(true)} />
            ) : undefined
          }
        />

        {babyProfile && !isProfileSettingsOpen ? (
          <View style={styles.hiddenProfileState}>
            <Text style={styles.hiddenProfileTitle}>{babyProfile.name}</Text>
            <Text style={styles.cardBody}>Profile details are hidden. Open edit only when you need to review or change them.</Text>
          </View>
        ) : null}

        {!babyProfile ? (
          <View style={styles.emptyState}>
            <Text style={styles.cardTitle}>{copy.profile.emptyTitle}</Text>
            <Text style={styles.cardBody}>{copy.profile.emptyBody}</Text>
          </View>
        ) : null}

        {babyProfile && isProfileSettingsOpen ? (
          <View style={styles.profileSummary}>
            <View style={styles.profileTop}>
              <View style={styles.profileTextBlock}>
                <Text style={styles.profileName}>{babyProfile.name}</Text>
                <Text style={styles.cardBody}>{profileMeta}</Text>
                <Text style={styles.locationText}>
                  {[babyProfile.country, babyProfile.region, babyProfile.street].filter(Boolean).join(" · ")}
                </Text>
              </View>
              <View style={styles.statRow}>
                <StatPill label="Feeding" value={copy.profile.feedingModes[babyProfile.feedingMode]} tone="warm" />
              </View>
            </View>
            {babyProfile.notes ? <Text style={styles.cardBody}>{babyProfile.notes}</Text> : null}
          </View>
        ) : null}

        {(!babyProfile || isProfileSettingsOpen) ? (
          <>
            <PanelHeader
              eyebrow="Location"
              title={`${locationDraft.country || copy.profile.country} · ${locationDraft.region || copy.profile.region}`}
              description={locationDraft.street || copy.profile.locationHint}
            />
            <PanelHeader eyebrow="Profile" title={copy.profile.title} description={copy.profile.emptyBody} />
            <Field label={copy.profile.name} value={name} onChangeText={setName} />
            <View style={styles.birthGroup}>
              <Text style={styles.birthLabel}>{copy.profile.birthDate}</Text>
              <View style={styles.birthRow}>
                <TextInput
                  value={birthYear}
                  onChangeText={setBirthYear}
                  placeholder="YYYY"
                  keyboardType="number-pad"
                  placeholderTextColor={palette.muted}
                  style={[styles.birthInput, styles.birthInputYear]}
                />
                <TextInput
                  value={birthMonth}
                  onChangeText={setBirthMonth}
                  placeholder="MM"
                  keyboardType="number-pad"
                  placeholderTextColor={palette.muted}
                  style={styles.birthInput}
                />
                <TextInput
                  value={birthDay}
                  onChangeText={setBirthDay}
                  placeholder="DD"
                  keyboardType="number-pad"
                  placeholderTextColor={palette.muted}
                  style={styles.birthInput}
                />
              </View>
            </View>
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
            <Button
              label={copy.profile.save}
              onPress={() =>
                saveBabyProfile({
                  country: locationDraft.country,
                  region: locationDraft.region,
                  street: locationDraft.street,
                  name,
                  birthDate: composedBirthDate,
                  feedingMode,
                  notes
                })
              }
            />
          </>
        ) : null}
      </Card>

      <Card tone="info">
        <PanelHeader
          eyebrow="Agent"
          title={copy.agent.title}
          description={copy.agent.memoryHint}
          action={<Button label={copy.agent.refresh} onPress={onRefreshAgent} disabled={isAgentRunning} />}
        />
        <View style={styles.statRow}>
          <StatPill label="Suggestions" value={recommendationCount} tone="default" />
          <StatPill label="Status" value={isAgentRunning ? "Running" : "Ready"} tone="warm" />
        </View>
      </Card>

      <Card tone="calm">
        <PanelHeader
          eyebrow={copy.vaccinations.eyebrow}
          title={copy.vaccinations.title}
          description={copy.vaccinations.helper}
          action={<StatPill label="" value={copy.vaccinations.sampleBadge} tone="default" />}
        />
        {vaccineStations.length === 0 ? (
          <Text style={styles.cardBody}>{copy.vaccinations.emptyAddress}</Text>
        ) : (
          <View style={styles.stationList}>
            {vaccineStations.map((station) => (
              <View key={station.id} style={styles.stationRow}>
                <Text style={styles.stationName}>{station.name}</Text>
                <Text style={styles.cardBody}>{station.addressLine}</Text>
                <View style={styles.stationMetaRow}>
                  <Text style={styles.stationMetaLabel}>{copy.vaccinations.distanceLabel}</Text>
                  <Text style={styles.stationMetaValue}>{station.distanceLabel}</Text>
                  <Text style={styles.stationMetaSeparator}>·</Text>
                  <Text style={styles.stationMetaLabel}>{copy.vaccinations.hoursLabel}</Text>
                  <Text style={styles.stationMetaValue}>{station.hours}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>

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
    gap: spacing.md
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
    gap: spacing.sm
  },
  profileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md
  },
  profileTextBlock: {
    flex: 1,
    gap: 6
  },
  locationText: {
    color: palette.accentDeep,
    fontSize: 13,
    fontWeight: "700"
  },
  profileName: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "800"
  },
  emptyState: {
    gap: 6
  },
  hiddenProfileState: {
    gap: spacing.xs
  },
  hiddenProfileTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  birthGroup: {
    gap: 6
  },
  birthLabel: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "700"
  },
  birthRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  birthInput: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 88,
    maxWidth: 140,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 18,
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: palette.ink,
    fontSize: 14
  },
  birthInputYear: {
    minWidth: 110,
    maxWidth: 160
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  stationList: {
    gap: spacing.md
  },
  stationRow: {
    gap: 4,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.line
  },
  stationName: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "800"
  },
  stationMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginTop: 2
  },
  stationMetaLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  stationMetaValue: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "700"
  },
  stationMetaSeparator: {
    color: palette.muted,
    fontSize: 13
  }
});
