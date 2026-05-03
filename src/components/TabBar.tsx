import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabKey } from "../types/domain";
import { palette, radius } from "../theme/tokens";

type Props = {
  activeTab: TabKey;
  labels: Record<TabKey, string>;
  onChange: (tab: TabKey) => void;
};

const keys: TabKey[] = ["today", "planner", "outings", "family"];

export function TabBar({ activeTab, labels, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {keys.map((key) => {
        const active = activeTab === key;
        return (
          <TouchableOpacity key={key} style={[styles.tab, active && styles.tabActive]} onPress={() => onChange(key)}>
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
    gap: 10
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  tabActive: {
    backgroundColor: palette.ink,
    borderColor: palette.ink
  },
  text: {
    color: palette.ink,
    fontWeight: "700",
    fontSize: 14
  },
  textActive: {
    color: palette.surface
  }
});
