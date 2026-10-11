export function practiceFingerprint(words, questions, day = null) {
  return JSON.stringify([day, words.map((word) => word.id), questions.map((question) => [question.id, question.options, question.answer, question.correctWord, question.acceptedAnswers, question.audio, question.passage, question.prompt])]);
}

export function resumablePractice(saved, fingerprint, wordCount, questionCount) {
  const limit = saved?.stage === "learn" ? wordCount : questionCount;
  return saved?.fingerprint === fingerprint && ["learn", "quiz", "guide"].includes(saved.stage) && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < limit && Array.isArray(saved.responses) && saved.responses.length <= questionCount && saved.responses.every((value) => typeof value === "boolean") ? saved : null;
}
