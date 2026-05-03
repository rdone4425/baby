import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PanelHeader } from "../components/PanelHeader";
import { StatPill } from "../components/StatPill";
import { Copy } from "../i18n/types";
import { AgentRecommendation } from "../types/agent";
import { BabyProfile, Locale, OutingChecklistItem, OutingScenario } from "../types/domain";
import { palette, radius, spacing } from "../theme/tokens";
import { createId } from "../utils/id";

type Props = {
  copy: Copy;
  babyProfile: BabyProfile | null;
  scenario: OutingScenario;
  checklist: OutingChecklistItem[];
  locale: Locale;
  recommendation: AgentRecommendation | null;
  onScenarioChange: (scenario: OutingScenario) => Promise<void>;
};

export function OutingsScreen({ copy, scenario, checklist, recommendation, onScenarioChange }: Props) {
  const [localChecklist, setLocalChecklist] = useState(checklist);
  const [customItem, setCustomItem] = useState("");

  useEffect(() => {
    setLocalChecklist(checklist);
  }, [checklist]);

  const recommendationText = useMemo(
    () => recommendation?.description || copy.agent.outingHint,
    [recommendation, copy.agent.outingHint]
  );
  const packedCount = localChecklist.filter((item) => item.packed).length;

  return (
    <View style={styles.stack}>
      <Card tone="info">
        <PanelHeader eyebrow="Outing Coach" title={copy.outings.title} description={copy.outings.helper} />
        <Text style={styles.agentBody}>{recommendationText}</Text>
        <View style={styles.metrics}>
          <StatPill label="Scenario" value={copy.outings.scenarios[scenario]} tone="cool" />
          <StatPill label="Packed" value={`${packedCount}/${localChecklist.length}`} tone="warm" />
          <StatPill label="Profile" value={checklist.length && recommendation ? "Ready" : "Draft"} />
        </View>
      </Card>

      <Card tone="default">
        <PanelHeader eyebrow="Scenario" title="Choose destination" />
        <View style={styles.pillRow}>
          {(Object.keys(copy.outings.scenarios) as OutingScenario[]).map((option) => (
            <Button
              key={option}
              label={copy.outings.scenarios[option]}
              variant={option === scenario ? "primary" : "secondary"}
              onPress={() => onScenarioChange(option)}
            />
          ))}
        </View>
      </Card>

      <Card tone="default">
        <PanelHeader eyebrow="Checklist" title="Pack with intention" description={copy.outings.checklistPlaceholder} />
        {localChecklist.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checkRow}
            onPress={() =>
              setLocalChecklist((current) =>
                current.map((entry) => (entry.id === item.id ? { ...entry, packed: !entry.packed } : entry))
              )
            }
          >
            <View style={[styles.checkDot, item.packed && styles.checkDotActive]} />
            <Text style={[styles.checkText, item.packed && styles.checkTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        <TextInput
          value={customItem}
          onChangeText={setCustomItem}
          placeholder={copy.outings.checklistPlaceholder}
          placeholderTextColor={palette.muted}
          style={styles.input}
        />
        <Button
          label={copy.outings.addItem}
          variant="secondary"
          onPress={() => {
            if (!customItem.trim()) {
              return;
            }
            setLocalChecklist((current) => [
              ...current,
              { id: createId("custom-outing"), label: customItem.trim(), packed: false }
            ]);
            setCustomItem("");
          }}
        />
      </Card>
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
  agentBody: {
    color: palette.accentDeep,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  checkDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.accent,
    backgroundColor: "transparent"
  },
  checkDotActive: {
    backgroundColor: palette.accent
  },
  checkText: {
    flex: 1,
    color: palette.ink,
    fontSize: 15
  },
  checkTextActive: {
    color: palette.muted,
    textDecorationLine: "line-through"
  },
  input: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: palette.ink,
    fontSize: 14
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  }
});
