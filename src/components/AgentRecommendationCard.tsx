import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AgentFeedbackVerdict, AgentRecommendation } from "../types/agent";
import { palette, radius } from "../theme/tokens";

type Props = {
  recommendation: AgentRecommendation;
  labels: {
    accept: string;
    ignore: string;
    notRelevant: string;
    showReason: string;
    hideReason: string;
    reasonTitle: string;
    sourceTitle: string;
  };
  onFeedback?: (verdict: AgentFeedbackVerdict) => void;
};

export function AgentRecommendationCard({ recommendation, labels, onFeedback }: Props) {
  const [showReason, setShowReason] = useState(false);
  const tone = recommendation.priority === "high" ? styles.high : recommendation.priority === "medium" ? styles.medium : styles.low;

  return (
    <View style={[styles.card, tone]}>
      <Text style={styles.title}>{recommendation.title}</Text>
      <Text style={styles.description}>{recommendation.description}</Text>
      <Text style={styles.meta}>Confidence {Math.round(recommendation.confidence * 100)}%</Text>

      <View style={styles.actions}>
        <FeedbackButton label={labels.accept} onPress={() => onFeedback?.("accepted")} />
        <FeedbackButton label={labels.ignore} onPress={() => onFeedback?.("ignored")} />
        <FeedbackButton label={labels.notRelevant} onPress={() => onFeedback?.("not_relevant")} />
      </View>

      <TouchableOpacity onPress={() => setShowReason((current) => !current)} style={styles.reasonToggle}>
        <Text style={styles.reasonToggleText}>{showReason ? labels.hideReason : labels.showReason}</Text>
      </TouchableOpacity>

      {showReason ? (
        <View style={styles.reasonBlock}>
          <Text style={styles.reasonHeading}>{labels.reasonTitle}</Text>
          <Text style={styles.reasonText}>{recommendation.reason}</Text>
          <Text style={styles.reasonHeading}>{labels.sourceTitle}</Text>
          <Text style={styles.reasonText}>{recommendation.sourceSignals.join(" · ")}</Text>
        </View>
      ) : null}
    </View>
  );
}

function FeedbackButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.feedbackButton}>
      <Text style={styles.feedbackText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    gap: 8
  },
  high: {
    backgroundColor: palette.dangerSoft,
    borderColor: palette.accent
  },
  medium: {
    backgroundColor: palette.infoSoft,
    borderColor: palette.teal
  },
  low: {
    backgroundColor: palette.calmSoft,
    borderColor: palette.sage
  },
  title: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "800"
  },
  description: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20
  },
  meta: {
    color: palette.accentDeep,
    fontSize: 12,
    fontWeight: "700"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  feedbackButton: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: palette.line
  },
  feedbackText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "700"
  },
  reasonToggle: {
    alignSelf: "flex-start"
  },
  reasonToggleText: {
    color: palette.accentDeep,
    fontSize: 12,
    fontWeight: "700"
  },
  reasonBlock: {
    gap: 4
  },
  reasonHeading: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "800"
  },
  reasonText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19
  }
});
