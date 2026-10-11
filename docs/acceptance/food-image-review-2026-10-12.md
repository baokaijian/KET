# Food Photo Review, 2026-10-12

Six previously unpublished icon templates were replaced with independently generated realistic photos. Codex viewed each original and each final 640 x 640 WebP before accepting the replacement as `fixed`; this is agent visual review, not an independent teacher signature. Original bytes were checked against the clean committed baseline before replacement. The complete actual prompts, final hashes, alt text, meanings and bilingual contexts are retained in `src/data/food-images.js`.

| Word | Final asset | Visual evidence and teaching scope | First-party meaning source |
| --- | --- | --- | --- |
| cake | public/word-images/l2_cake.webp | One slice has two sponge layers, cream and pink icing; the edible subject is complete although the supporting plate edge is cropped. Teaches cake as food, not every idiom. | [Cambridge: cake](https://dictionary.cambridge.org/dictionary/english/cake) |
| carrot | public/word-images/l2_carrot.webp | One intact tapered orange root and green leaves; some upper leaf tips meet the frame edge. The sentence describes this orange example, not all carrot varieties. | [Cambridge: carrot](https://dictionary.cambridge.org/dictionary/english/carrot) |
| chicken | public/word-images/l2_chicken.webp | A recognizable cooked drumstick and thigh, browned skin and white meat. The photo specifies 鸡肉; the full 鸡；鸡肉 gloss is unchanged. Visual appearance is not a food-safety assessment. | [Cambridge: chicken](https://dictionary.cambridge.org/dictionary/english/chicken?q=chicken_2) |
| potato | public/word-images/l2_potato.webp | One full oval potato, brown skin and shallow eyes, no sprouts or green skin; distinguish from bread or sweet potato. | [Cambridge: potato](https://dictionary.cambridge.org/dictionary/english/potato) |
| rice | public/word-images/l2_rice.webp | Cooked white rice with distinct grains in a complete bowl, not porridge or mashed potato. The photo specifies 米饭; full 大米；米饭 gloss remains. | [Cambridge: rice](https://dictionary.cambridge.org/dictionary/english/rice) |
| soup | public/word-images/l2_soup.webp | Visible liquid surrounding carrot rounds, peas and other vegetables; not dry vegetables or a drink. Vegetable soup is one example of the broader food noun. | [Cambridge: soup](https://dictionary.cambridge.org/dictionary/english/soup) |

The six original short examples are teaching contexts, not copied dictionary quotations. All six retain the official noun part of speech and `food_cafe` primary category; no health word is added to restaurant content. Individual hashes are unique and unreviewed bank images remain unpublished.

Data tests validate identity, individual assets, review fields, exact contexts, full glosses and generation prompts. Browser tests open each actual dictionary entry within the restaurant category, check picture decoding, parts of speech, photo-sense labels, bilingual examples and submitted speech text, and capture separate picture/context viewports. Actual screenshot review and the final platform results are recorded in `child-learning-acceptance.md`; mock TTS does not certify a system voice.
