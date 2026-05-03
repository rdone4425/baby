import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { palette, radius } from "../theme/tokens";

type Props = PropsWithChildren<{
  tone?: "default" | "accent" | "info" | "calm";
}>;

export function Card({ children, tone = "default" }: Props) {
  return <View style={[styles.base, toneStyle[tone]]}>{children}</View>;
}

const toneStyle = StyleSheet.create({
  default: {
    backgroundColor: palette.surface,
    borderColor: palette.line
  },
  accent: {
    backgroundColor: palette.dangerSoft,
    borderColor: palette.accent
  },
  info: {
    backgroundColor: palette.infoSoft,
    borderColor: palette.teal
  },
  calm: {
    backgroundColor: palette.calmSoft,
    borderColor: palette.sage
  }
});

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 16,
    gap: 8
  }
});
