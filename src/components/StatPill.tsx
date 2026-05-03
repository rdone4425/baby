import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette, radius, spacing } from "../theme/tokens";

type Props = {
  label: string;
  value: string;
  tone?: "default" | "warm" | "cool";
};

export function StatPill({ label, value, tone = "default" }: Props) {
  return (
    <View style={[styles.base, toneStyles[tone]]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const toneStyles = StyleSheet.create({
  default: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: palette.line
  },
  warm: {
    backgroundColor: "#fff2e8",
    borderColor: "#efb48e"
  },
  cool: {
    backgroundColor: "#eef6f6",
    borderColor: "#9ec5c0"
  }
});

const styles = StyleSheet.create({
  base: {
    minWidth: 92,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 2
  },
  label: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  value: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "800"
  }
});
