// Overlapping senses are unsuitable distractors for a context-free meaning question.
export const meaningGroups = {
  mother: ["mother", "mum", "mom"], father: ["father", "dad"],
  grandmother: ["grandmother", "grandma"], grandfather: ["grandfather", "grandpa"],
  bicycle: ["bicycle", "bike"], telephone: ["phone", "telephone", "cell phone"],
  refrigerator: ["fridge", "refrigerator"], film: ["film", "movie"],
  illness: ["ill", "sick"], large: ["big", "large"], small: ["small", "little"],
  shop: ["shop", "store"], beginning: ["begin", "beginning", "start"],
  completion: ["complete", "finish", "end"], almost: ["almost", "nearly"],
  anyone: ["anybody", "anyone"], nobody: ["nobody", "no one"],
  someone: ["somebody", "someone"], everyone: ["everybody", "everyone"],
  fuel_station: ["petrol station", "gas station"], autumn: ["autumn", "fall"],
  dinner: ["dinner", "supper"],
};

const byWord = Object.fromEntries(Object.entries(meaningGroups).flatMap(([concept, words]) => words.map((word) => [word, concept])));
export function meaningKey(word) {
  const concept = byWord[word.word.toLowerCase()];
  return concept ? `concept:${concept}` : `meaning:${word.translation}`;
}
