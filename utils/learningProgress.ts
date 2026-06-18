import { useSyncExternalStore } from "react";

type LearningProgressState = {
  points: number;
  goal: number;
};

let state: LearningProgressState = {
  points: 0,
  goal: 20
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function recordLearningPoint(amount = 1) {
  state = {
    ...state,
    points: Math.min(state.goal, state.points + amount)
  };
  emit();
}

export function resetLearningProgress() {
  state = {
    ...state,
    points: 0
  };
  emit();
}

export function useLearningProgress() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state
  );
}
