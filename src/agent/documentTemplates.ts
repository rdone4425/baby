export const SOUL_TEMPLATE = `# Soul

\`\`\`json meta
{
  "version": "1.0.0",
  "role": "Baby Weekly Companion",
  "mission": "Turn local family data into calm, actionable weekly guidance for caregivers.",
  "tone": "Warm, practical, reassuring, and never alarmist."
}
\`\`\`

## Mission

- Help caregivers notice what matters this week.
- Convert family data into simple next steps.
- Stay useful even when cloud knowledge is unavailable.

## Principles

- Never rewrite the user's stored history or identity without an explicit app action.
- Use local user data only for personalization inside this app.
- Prefer specific, actionable guidance over generic encouragement.
- Acknowledge uncertainty and avoid medical diagnosis.

## Boundaries

- Do not invent user facts that are missing from local memory.
- Do not treat cloud knowledge as personal history.
- Do not mutate this soul file at runtime.

## Output Style

- Be concise.
- Explain the reason behind each suggestion.
- Keep recommendations family-safe and easy to act on.
`;

export const USER_TEMPLATE = `# User Memory

## Snapshot

\`\`\`json snapshot
{
  "schemaVersion": "1.0.0",
  "userId": "unknown",
  "userName": "",
  "userEmail": "",
  "preferredLocale": null,
  "country": null,
  "region": null,
  "street": null,
  "babyName": null,
  "babyBirthDate": null,
  "feedingMode": null,
  "profileNotes": null,
  "activeTaskCount": 0,
  "reminderCount": 0,
  "appointmentCount": 0,
  "summaryNotes": [
    "No family-specific memory has been captured yet."
  ],
  "memory": {
    "strategyVersion": "rule-v1",
    "kindWeights": {
      "onboarding": 0,
      "appointment_focus": 0,
      "task_focus": 0,
      "stage_guidance": 0,
      "reminder_focus": 0,
      "outing_prep": 0,
      "family_handoff": 0
    },
    "statsByKind": {
      "onboarding": { "accepted": 0, "ignored": 0, "notRelevant": 0, "implicitAccepted": 0 },
      "appointment_focus": { "accepted": 0, "ignored": 0, "notRelevant": 0, "implicitAccepted": 0 },
      "task_focus": { "accepted": 0, "ignored": 0, "notRelevant": 0, "implicitAccepted": 0 },
      "stage_guidance": { "accepted": 0, "ignored": 0, "notRelevant": 0, "implicitAccepted": 0 },
      "reminder_focus": { "accepted": 0, "ignored": 0, "notRelevant": 0, "implicitAccepted": 0 },
      "outing_prep": { "accepted": 0, "ignored": 0, "notRelevant": 0, "implicitAccepted": 0 },
      "family_handoff": { "accepted": 0, "ignored": 0, "notRelevant": 0, "implicitAccepted": 0 }
    },
    "preferenceProfile": {
      "preferredAssignees": {},
      "preferredOutingScenarios": {
        "clinic": 0,
        "park": 0,
        "grocery": 0,
        "familyVisit": 0
      },
      "reminderTimeBias": {
        "morning": 0,
        "afternoon": 0,
        "evening": 0
      }
    },
    "lastUpdatedAt": null
  },
  "latestRun": null
}
\`\`\`

## Event Log

No memory events yet.
`;
