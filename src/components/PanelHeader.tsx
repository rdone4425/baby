import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette, spacing } from "../theme/tokens";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PanelHeader({ eyebrow, title, description, action }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md
  },
  copy: {
    flex: 1,
    gap: spacing.xs
  },
  eyebrow: {
    color: palette.accentDeep,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  title: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "800"
  },
  description: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20
  },
  action: {
    alignSelf: "center"
  }
});
