import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabKey } from "../types/domain";
import { palette, radius, spacing } from "../theme/tokens";

type Props = {
  activeTab: TabKey;
  labels: Record<TabKey, string>;
  onChange: (tab: TabKey) => void;
};

const keys: TabKey[] = ["today", "planner", "outings", "family"];
const tabAccents: Record<TabKey, string> = {
  today: palette.accentDeep,
  planner: palette.teal,
  outings: palette.sage,
  family: palette.plum
};

export function TabBar({ activeTab, labels, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {keys.map((key) => {
        const active = activeTab === key;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.tab, active && styles.tabActive, active && { borderColor: tabAccents[key] }]}
            onPress={() => onChange(key)}
          >
            <View style={[styles.dot, { backgroundColor: tabAccents[key] }]} />
            <Text style={[styles.text, active && styles.textActive]}>{labels[key]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  tab: {
    width: "48%",
    minWidth: 140,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: "rgba(255,255,255,0.66)",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  tabActive: {
    backgroundColor: palette.surface
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill
  },
  text: {
    color: palette.ink,
    fontWeight: "700",
    fontSize: 14
  },
  textActive: {
    color: palette.ink
  }
});
