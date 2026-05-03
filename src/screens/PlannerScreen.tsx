import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Copy } from "../i18n/types";
import { AgentRecommendation } from "../types/agent";
import { Locale, Reminder, WeeklyPlanItem } from "../types/domain";
import { formatDateTime } from "../utils/date";
import { palette } from "../theme/tokens";

type Props = {
  copy: Copy;
  locale: Locale;
  weeklyPlan: WeeklyPlanItem[];
  reminders: Reminder[];
  nextAction: string;
  recommendations: AgentRecommendation[];
  onSaveAppointment: (input: { title: string; startsAt: string; location: string; notes: string }) => Promise<void>;
  onSaveReminder: (input: { title: string; dueAt: string }) => Promise<void>;
  onRefreshAgent: () => Promise<void>;
  isAgentRunning: boolean;
};

export function PlannerScreen({
  copy,
  locale,
  weeklyPlan,
  reminders,
  nextAction,
  recommendations,
  onSaveAppointment,
  onSaveReminder,
  onRefreshAgent,
  isAgentRunning
}: Props) {
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentStartsAt, setAppointmentStartsAt] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDueAt, setReminderDueAt] = useState("");

  const recommendationSummary = useMemo(
    () => recommendations.slice(0, 2).map((item) => item.description).join(" "),
    [recommendations]
  );

  return (
    <View style={styles.stack}>
      <Card tone="info">
        <Text style={styles.cardTitle}>{copy.agent.title}</Text>
        <Text style={styles.cardBody}>{recommendationSummary || copy.agent.plannerHint}</Text>
        <Button label={copy.agent.refresh} onPress={onRefreshAgent} disabled={isAgentRunning} />
      </Card>

      <Card tone="default">
        <Text style={styles.cardTitle}>{copy.planner.title}</Text>
        {weeklyPlan.length === 0 ? (
          <Text style={styles.cardBody}>{copy.today.empty}</Text>
        ) : (
          weeklyPlan.map((item) => (
            <View key={item.id} style={styles.timelineRow}>
              <Text style={styles.timelineDay}>{item.dayLabel}</Text>
              <View style={styles.timelineBody}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.detail}</Text>
              </View>
            </View>
          ))
        )}
      </Card>

      <Card tone="info">
        <Text style={styles.cardTitle}>{copy.planner.nextActionTitle}</Text>
        <Text style={styles.cardBody}>{nextAction}</Text>
      </Card>

      <Card tone="default">
        <Text style={styles.cardTitle}>{copy.planner.remindersTitle}</Text>
        {reminders.length === 0 ? (
          <Text style={styles.cardBody}>{copy.today.empty}</Text>
        ) : (
          reminders.map((item) => (
            <View key={item.id} style={styles.reminderRow}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{formatDateTime(item.dueAt, locale)}</Text>
            </View>
          ))
        )}
      </Card>

      <Card tone="default">
        <Text style={styles.cardTitle}>{copy.planner.appointmentFormTitle}</Text>
        <Field label={copy.planner.appointmentFields.title} value={appointmentTitle} onChangeText={setAppointmentTitle} />
        <Field label={copy.planner.appointmentFields.startsAt} value={appointmentStartsAt} onChangeText={setAppointmentStartsAt} />
        <Field label={copy.planner.appointmentFields.location} value={appointmentLocation} onChangeText={setAppointmentLocation} />
        <Field label={copy.planner.appointmentFields.notes} value={appointmentNotes} onChangeText={setAppointmentNotes} multiline />
        <Button
          label={copy.planner.saveAppointment}
          onPress={async () => {
            await onSaveAppointment({
              title: appointmentTitle,
              startsAt: appointmentStartsAt,
              location: appointmentLocation,
              notes: appointmentNotes
            });
            setAppointmentTitle("");
            setAppointmentStartsAt("");
            setAppointmentLocation("");
            setAppointmentNotes("");
          }}
        />
      </Card>

      <Card tone="default">
        <Text style={styles.cardTitle}>{copy.planner.reminderFormTitle}</Text>
        <Field label={copy.planner.reminderFields.title} value={reminderTitle} onChangeText={setReminderTitle} />
        <Field label={copy.planner.reminderFields.dueAt} value={reminderDueAt} onChangeText={setReminderDueAt} />
        <Button
          label={copy.planner.saveReminder}
          onPress={async () => {
            await onSaveReminder({ title: reminderTitle, dueAt: reminderDueAt });
            setReminderTitle("");
            setReminderDueAt("");
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
    lineHeight: 21
  },
  timelineRow: {
    flexDirection: "row",
    gap: 12
  },
  timelineDay: {
    width: 46,
    color: palette.accentDeep,
    fontWeight: "800",
    marginTop: 2
  },
  timelineBody: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.line
  },
  itemTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "800"
  },
  reminderRow: {
    gap: 4
  }
});
