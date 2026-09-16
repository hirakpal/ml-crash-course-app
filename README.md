# ml-crash-course-app

Interactive Expo mobile app that teaches machine learning fundamentals, neural networks, LLM concepts, training, and practical applications inspired by Google's Machine Learning Crash Course.

## Features

- Offline-first curriculum seeded into SQLite on first launch
- Sequential lesson flow with completion tracking and best quiz scores
- End-of-lesson multiple-choice quizzes
- Remote course outline sync helper for `https://developers.google.com/machine-learning/crash-course/llm`
- Interactive visualizations for:
  - neural network layer flow
  - activation functions
  - learning-rate / loss-curve behavior
  - confusion matrix metrics
- React Native Paper UI optimized for mobile screens

## Project structure

```text
/src
  /screens
  /components
  /utils
  /redux
  /data
  /visualizations
  /types
```

## Getting started

```bash
npm install
npm run start
```

Then open the Expo app on a simulator or device.

## Validation

```bash
npm run typecheck
```

## Notes

- The app stores lesson content and progress locally for offline access.
- The remote sync button fetches the public course page when network access is available and saves the fetched outline metadata into SQLite.
