export function pickNextIndex(currentIndex: number, length: number, recent: number[]) {
  if (length <= 1) {
    return 0;
  }

  const recentSet = new Set(recent.slice(-5));
  const candidates = Array.from({ length }, (_, index) => index).filter(
    (index) => index !== currentIndex && !recentSet.has(index)
  );

  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  const fallback = (currentIndex + 1) % length;
  return fallback;
}

type WeightedQuestion = {
  id: string;
  weight: number;
};

export function pickWeakQuestionId(
  questions: readonly { id: string }[],
  mistakeCounts: Record<string, number>,
  currentId: string,
  recentIds: readonly string[]
) {
  const recentSet = new Set(recentIds.slice(-5));
  const weightedQuestions: WeightedQuestion[] = questions
    .filter((question) => question.id !== currentId && !recentSet.has(question.id))
    .map((question) => ({
      id: question.id,
      weight: mistakeCounts[question.id] ?? 0
    }))
    .filter((question) => question.weight > 0);

  if (weightedQuestions.length > 0) {
    const highestWeight = Math.max(...weightedQuestions.map((question) => question.weight));
    const topCandidates = weightedQuestions.filter((question) => question.weight === highestWeight);
    return topCandidates[Math.floor(Math.random() * topCandidates.length)]?.id ?? currentId;
  }

  const fallback = questions.find((question) => question.id !== currentId && !recentSet.has(question.id));
  return fallback?.id ?? currentId;
}

export function increaseMistakeCount(
  counts: Record<string, number>,
  id: string
): Record<string, number> {
  return {
    ...counts,
    [id]: (counts[id] ?? 0) + 1
  };
}

export function decreaseMistakeCount(
  counts: Record<string, number>,
  id: string
): Record<string, number> {
  const current = counts[id] ?? 0;
  if (current <= 1) {
    const { [id]: _removed, ...rest } = counts;
    return rest;
  }

  return {
    ...counts,
    [id]: current - 1
  };
}
