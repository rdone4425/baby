import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "./Button";
import { Card } from "./Card";
import { Field } from "./Field";
import { PanelHeader } from "./PanelHeader";
import { Copy } from "../i18n/types";
import { Locale } from "../types/domain";
import { palette, radius, spacing } from "../theme/tokens";

export type LocationDraft = {
  country: string;
  region: string;
  street: string;
};

type Props = {
  copy: Copy;
  locale: Locale;
  initialValue: LocationDraft;
  onLocaleChange: (locale: Locale) => void;
  onConfirm: (value: LocationDraft) => void;
};

export function LocationGate({ copy, locale, initialValue, onLocaleChange, onConfirm }: Props) {
  const [country, setCountry] = useState(initialValue.country);
  const [region, setRegion] = useState(initialValue.region);
  const [street, setStreet] = useState(initialValue.street);

  return (
    <View style={styles.shell}>
      <Card tone="default" style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ONBOARDING</Text>
        </View>
        <PanelHeader eyebrow="Step 1" title={copy.profile.languageTitle} description={copy.profile.languageHint} />
        <View style={styles.languageRow}>
          {(Object.keys(copy.languageOptions) as Locale[]).map((option) => {
            const active = option === locale;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => onLocaleChange(option)}
                style={[styles.languagePill, active && styles.languagePillActive]}
              >
                <Text style={[styles.languageText, active && styles.languageTextActive]}>{copy.languageOptions[option]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <PanelHeader eyebrow="Step 2" title={copy.profile.locationTitle} description={copy.profile.locationHint} />
        <View style={styles.stack}>
          <Field label={copy.profile.country} value={country} onChangeText={setCountry} />
          <Field label={copy.profile.region} value={region} onChangeText={setRegion} />
          <Field label={copy.profile.street} value={street} onChangeText={setStreet} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>3 / 3</Text>
          <Text style={styles.footerHint}>Location context for this device</Text>
        </View>
        <Button
          label={copy.profile.locationContinue}
          onPress={() =>
            onConfirm({
              country: country.trim(),
              region: region.trim(),
              street: street.trim()
            })
          }
          disabled={!country.trim() || !region.trim() || !street.trim()}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    alignItems: "stretch",
    paddingTop: spacing.md
  },
  card: {
    width: "100%",
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: palette.surface,
    borderColor: "rgba(126,166,161,0.28)",
    shadowColor: "#172126",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    gap: spacing.md
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: palette.dangerSoft,
    borderWidth: 1,
    borderColor: "rgba(213,110,75,0.22)"
  },
  badgeText: {
    color: palette.accentDeep,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6
  },
  stack: {
    gap: spacing.sm
  },
  languageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  languagePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: "rgba(255,255,255,0.72)"
  },
  languagePillActive: {
    backgroundColor: palette.ink,
    borderColor: palette.ink
  },
  languageText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "700"
  },
  languageTextActive: {
    color: palette.surface
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  footerText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "800"
  },
  footerHint: {
    flexShrink: 1,
    color: palette.muted,
    fontSize: 12
  }
});
