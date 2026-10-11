import metadata from "./vocabulary-metadata.json" with { type: "json" };
import { topicCategories } from "./ket-words/levels.js";
import { supplementaryTopics } from "./course-topics.js";
import { curatedTopics } from "./curated-topics.js";

export const partOfSpeechLabels = {
  n: "n. 名词", v: "v. 动词", adj: "adj. 形容词", adv: "adv. 副词",
  prep: "prep. 介词", pron: "pron. 代词", det: "det. 限定词", conj: "conj. 连词",
  av: "aux. 助动词", mv: "modal v. 情态动词", "phr v": "phr. v. 短语动词",
  "prep phr": "prep. phr. 介词短语", exclam: "exclam. 感叹词", abbrev: "abbr. 缩略词",
};
const topicMap = {
  "Food and Drink": "food_cafe", "Health, Medicine and Exercise": "body_health",
  "Family and Friends": "family_friends", Education: "school_library",
  "House and Home": "home_room", "The Natural World": "nature_weather",
  "Clothes": "clothes", Colours: "feelings_descriptions",
  "Personal Feelings, Opinions and Experiences": "feelings_descriptions",
  "Travel and Transport": "city_travel", "Places: Town and City": "city_travel",
  "Places: Countryside": "nature_weather", "Places: Buildings": "city_travel",
  "Communication and Technology": "tech_media", "Entertainment and Media": "tech_media",
  "Documents and Texts": "school_library", "Hobbies and Leisure": "sports_hobbies", Sport: "sports_hobbies",
  Shopping: "shopping_work", "Work and Jobs": "shopping_work", Services: "city_travel",
  Measurements: "school_library", Time: "time_calendar",
};
const unitTopic = { 1: "daily_starters", 2: "food_cafe", 3: "home_room", 4: "school_library", 5: "city_travel", 6: "nature_weather", 7: "sports_hobbies", 8: "feelings_descriptions", 9: "shopping_work", 10: "tech_media", 11: "exam_expressions" };
const supplemental = Object.fromEntries(Object.entries(supplementaryTopics).flatMap(([unit, words]) => words.map((word) => [word, unitTopic[unit]])));
const explicit = {
  accident: "body_health", ambulance: "body_health", appointment: "body_health", baby: "family_friends",
  back: "body_health", body: "body_health", blood: "body_health", brain: "body_health", check: "body_health",
  chemist: "body_health", comb: "body_health", danger: "body_health", dangerous: "body_health", dead: "body_health",
  doctor: "body_health", drugstore: "body_health", exercise: "body_health", hand: "body_health", head: "body_health",
  headache: "body_health", health: "body_health", healthy: "body_health", heart: "body_health", medicine: "body_health",
  mouth: "body_health", nose: "body_health", pale: "body_health", pharmacy: "body_health", rest: "body_health",
  sick: "body_health", stomach: "body_health", toe: "body_health", tooth: "body_health", toothache: "body_health", toothbrush: "body_health",
  run: "sports_hobbies", walk: "sports_hobbies", up: "daily_starters", well: "feelings_descriptions",
  clean: "home_room", wash: "home_room", fish: "animals", book: "school_library",
  kitchen: "home_room", fridge: "home_room", cooker: "home_room", coat: "clothes",
  "Dr": "body_health", "litre": "school_library", "litre / liter": "school_library",
  can: "daily_starters", break: "daily_starters", bit: "daily_starters", fat: "feelings_descriptions",
  box: "home_room", cut: "daily_starters",
};
const animalWords = new Set("animal|bear|bee|beetle|bird|butterfly|camel|cat|cow|creature|crocodile|dinosaur|dog|dolphin|donkey|duck|eagle|elephant|frog|giraffe|goat|hippo|horse|insect|jellyfish|kangaroo|kitten|lion|lizard|monkey|octopus|panda|parrot|penguin|pet|polar bear|puppy|rabbit|shark|sheep|snail|snake|spider|swan|tiger|tortoise|whale|zebra".split("|"));
const clothesWords = new Set("belt|boot|cap|coat|dress|glasses|glove|hat|jacket|jeans|jumper|shirt|shoe|shorts|skirt|sock|suit|sunglasses|tights|trousers|bathing suit|swimming costume".split("|"));
export function vocabularyKey(word) {
  return word.toLowerCase().replace("yog(h)urt", "yoghurt").replace(/[^a-z0-9]+/g, "");
}
export function metadataFor(word) {
  return metadata.entries[vocabularyKey(word)];
}
export function withVocabularyMetadata(word) {
  const entry = metadataFor(word.word);
  if (!entry) throw new Error(`Missing official POS: ${word.word}`);
  const pos = entry.pos.filter((value) => partOfSpeechLabels[value]);
  if (!pos.length) throw new Error(`Invalid official POS: ${word.word}`);
  const officialTopic = entry.topics.map((name) => topicMap[name]).find(Boolean);
  const topic = animalWords.has(word.word) ? "animals" : clothesWords.has(word.word) ? "clothes" : explicit[word.word] || curatedTopics[word.word] || officialTopic || supplemental[word.word] || word.topic;
  const category = topicCategories.find((item) => item.id === topic);
  return { ...word, topic, scene: category.scene, scenePrompt: category.scenePrompt,
    partOfSpeech: pos, partOfSpeechLabel: pos.map((value) => partOfSpeechLabels[value]).join(" / "),
    grammarNotes: entry.pos.includes("pl") ? "复数形式" : "", posSource: metadata.source };
}
