# Baby Weekly Companion Mobile

An Expo React Native MVP for a mobile-first `Baby Planning Agent`.

## Product shape

This app is intentionally not a generic tracker or chat bot. The first version is built around four surfaces:

- `Today`: what matters right now
- `Planner`: weekly milestones, appointments, and action items
- `Outings`: weather-aware packing and wear guidance
- `Family`: caregiver coordination and shared responsibilities

The current prototype includes lightweight built-in i18n with English and Simplified Chinese UI copy.

## Run locally

1. Install dependencies with `npm install`
2. Start the app with `npm run start`
3. Open on iOS Simulator, Android Emulator, or Expo Go

## GitHub build outputs

This repository uses one Android build path for device testing:

- `android-debug`: GitHub Actions builds a local debug APK artifact

### Which workflow to use

- Use `android-debug`
- Download the APK artifact from the GitHub Actions run
- Install it on an Android phone for testing

## MVP direction

- English-speaking new parents
- Subscription-friendly weekly planning UX
- Agent-style guidance without pretending to be a doctor
- Clear boundaries around medical advice
