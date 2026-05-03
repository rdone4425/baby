import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { palette, radius } from "../theme/tokens";

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
};

export function Field({ label, value, onChangeText, multiline, placeholder }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6
  },
  label: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "700"
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
  multiline: {
    minHeight: 84,
    textAlignVertical: "top"
  }
});
