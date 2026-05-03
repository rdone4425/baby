import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Copy } from "../i18n/types";
import { AgentRecommendation } from "../types/agent";
import { FamilyTask, Locale } from "../types/domain";
import { formatDateTime } from "../utils/date";
import { palette } from "../theme/tokens";

type Props = {
  copy: Copy;
  locale: Locale;
  tasks: FamilyTask[];
  recommendation: AgentRecommendation | null;
  onSaveTask: (input: { assigneeName: string; title: string; dueAt: string }) => Promise<void>;
};

export function FamilyScreen({ copy, locale, tasks, recommendation, onSaveTask }: Props) {
  const [assigneeName, setAssigneeName] = useState("");
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");

  const familyHint = useMemo(
    () => recommendation?.description || copy.agent.familyHint,
    [recommendation, copy.agent.familyHint]
  );

  return (
    <View style={styles.stack}>
      <Card tone="info">
        <Text style={styles.cardTitle}>{copy.family.title}</Text>
        <Text style={styles.cardBody}>{familyHint}</Text>
      </Card>

      <Card tone="default">
        <Text style={styles.cardTitle}>{copy.family.title}</Text>
        {tasks.length === 0 ? (
          <Text style={styles.cardBody}>{copy.family.empty}</Text>
        ) : (
          tasks.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.assigneeName}</Text>
                <Text style={styles.cardBody}>{formatDateTime(item.dueAt, locale)}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{item.status}</Text>
              </View>
            </View>
          ))
        )}
      </Card>

      <Card tone="default">
        <Text style={styles.cardTitle}>{copy.family.formTitle}</Text>
        <Field label={copy.family.assignee} value={assigneeName} onChangeText={setAssigneeName} />
        <Field label={copy.family.task} value={title} onChangeText={setTitle} />
        <Field label={copy.family.dueAt} value={dueAt} onChangeText={setDueAt} />
        <Button
          label={copy.family.save}
          onPress={async () => {
            await onSaveTask({ assigneeName, title, dueAt });
            setAssigneeName("");
            setTitle("");
            setDueAt("");
          }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  cardBody: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.line
  },
  col: {
    flex: 1,
    gap: 4
  },
  itemTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "800"
  },
  pill: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  pillText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "700"
  }
});
