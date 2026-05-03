import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { palette, radius } from "../theme/tokens";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function Button({ label, onPress, variant = "primary", disabled }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, variant === "secondary" ? styles.secondary : styles.primary, disabled && styles.disabled]}
    >
      <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  primary: {
    backgroundColor: palette.accentDeep
  },
  secondary: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line
  },
  disabled: {
    opacity: 0.6
  },
  text: {
    color: palette.surface,
    fontSize: 14,
    fontWeight: "800"
  },
  secondaryText: {
    color: palette.ink
  }
});
