import { useEffect, useSyncExternalStore } from "react";

export type LearningPath = {
  label: string;
  route:
    | "/"
    | "/letters"
    | "/letters-plus"
    | "/words"
    | "/sentences"
    | "/paragraphs"
    | "/verses"
    | "/writing";
};

let currentPath: LearningPath = {
  label: "Stufe 1: Buchstaben",
  route: "/letters"
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function recordLearningPath(path: LearningPath) {
  currentPath = path;
  emit();
}

export function useLearningPath() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => currentPath,
    () => currentPath
  );
}

export function useRecordLearningPath(path: LearningPath) {
  useEffect(() => {
    recordLearningPath(path);
  }, [path.label, path.route]);
}
