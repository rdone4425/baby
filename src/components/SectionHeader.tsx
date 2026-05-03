import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/tokens";

type Props = {
  eyebrow: string;
  title: string;
};

export function SectionHeader({ eyebrow, title }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4
  },
  eyebrow: {
    color: palette.accentDeep,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  title: {
    color: palette.ink,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800"
  }
});
