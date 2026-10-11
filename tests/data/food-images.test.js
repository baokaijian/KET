import { describe, expect, it } from "vitest";
import { foodImages } from "../../src/data/food-images.js";
import { courseWordById } from "../../src/data/curriculum.js";
import { wordImages } from "../../src/data/word-images.js";
import { wordImagePlans } from "../../src/data/word-image-plans.js";
import { countEnglishWords } from "../../src/utils/learningProgress.js";

const ids = ["l2_cake", "l2_carrot", "l2_chicken", "l2_potato", "l2_rice", "l2_soup"];
describe("meaning-specific food photographs", () => {
  it("publishes a separate reviewed photo and short bilingual context for each food word", () => {
    expect(Object.keys(foodImages)).toEqual(ids);
    expect(new Set(Object.values(foodImages).map((image) => image.sha256)).size).toBe(6);
    for (const id of ids) {
      const image = foodImages[id];
      const word = courseWordById[id];
      expect(wordImages[id]).toBe(image);
      expect(word.image).toBe(image);
      expect(image.src).toBe(`word-images/${id}.webp`);
      expect(image.reviewStatus).toBe("fixed");
      expect(image.requiresContext).toBe(true);
      expect(image.meaningSource).toBe(`https://dictionary.cambridge.org/dictionary/english/${word.word}`);
      expect(image.note.length).toBeGreaterThan(100);
      expect(wordImagePlans[id].prompt).toContain(image.generationPrompt);
      expect(word.sentence).toBe(image.context.sentence);
      expect(word.sentenceTranslation).toBe(image.context.translation);
      expect(countEnglishWords(word.sentence)).toBeLessThanOrEqual(8);
      expect(word.partOfSpeech).toEqual(["n"]);
      expect(word.topic).toBe("food_cafe");
    }
  });
  it("keeps chicken and rice full meanings separate from the pictured food sense", () => {
    expect(courseWordById.l2_chicken.translation).toBe("鸡；鸡肉");
    expect(foodImages.l2_chicken.meaning).toBe("鸡肉（照片只表达作为食物的含义）");
    expect(foodImages.l2_chicken.context.sentence).toBe("This is cooked chicken.");
    expect(courseWordById.l2_rice.translation).toBe("大米；米饭");
    expect(foodImages.l2_rice.meaning).toBe("米饭（图中为煮熟的白米饭）");
    expect(foodImages.l2_rice.alt).toContain("individual grains visible");
    expect(foodImages.l2_soup.alt).toContain("visible liquid");
    expect(foodImages.l2_cake.alt).toContain("baked layers");
    expect(foodImages.l2_carrot.alt).toContain("pointed root");
    expect(foodImages.l2_potato.alt).toContain("shallow eyes");
  });
});
