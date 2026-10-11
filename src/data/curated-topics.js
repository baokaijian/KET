// Primary teaching senses for words absent from the official topic appendix.
export const curatedTopicGroups = {
  time_calendar: "after|afterwards|ago|already|April|August|before|beginning|December|during|ever|February|final|finally|first|Friday|future|immediately|January|July|June|just|last|lunchtime|March|May|midday|Monday|never|next|November|now|October|often|once|recently|Saturday|September|since|sometimes|soon|still|suddenly|Sunday|then|Thursday|till|Tuesday|twice|until|usual|usually|Wednesday|while|yet",
  positions: "against|among|around|below|beside|between|by|from|further|here|into|over|round|there|through|under",
  daily_starters: "actually|almost|as|as well|at all|but|certainly|else|enough|especially|even|exactly|except|few|for|however|if|including|instead|lots / a lot|maybe|mine|of|only|or|other|per|perhaps|possibly|probably|quite|really|several|so|such|than|the|to|together|too|variety|various|very|whole|with|without",
  exam_expressions: "advice|anyway|excuse|Guess what?|oh|oh dear!|OK / okay|pardon|poor thing / you|wow",
  shopping_work: "available|bag",
  family_friends: "birth|born|crowd|kiss|life|national|nationality|mom|mum|dad|grandma|grandpa",
  feelings_descriptions: "broken|colour|extra|fair|fantastic|full|impossible|little|luckily|missing|pity|possible|shame|trouble|unfortunately|worry",
  home_room: "build|fix|gas|indoor|indoors|shampoo|sleep|tidy",
  city_travel: "gas station|lost|stamp",
  nature_weather: "cloud|cloudy|foggy|storm|warm|weather|wind|windy",
  school_library: "add|part|story|topic",
  sports_hobbies: "dive|Olympic",
  tech_media: "clown",
  body_health: "smoke|smoking",
  full_review: "agree|allow|become|begin|believe|belong|bother|bring|carry|choose|complete|continue|cry|discover|fill|follow|guess|happen|hope|hurry|include|keep|let|lose|matter|mean|mind|mix|notice|pass|plan|prepare|reason|ring|see|seem|send|share|shout|sit|sort|speak|stand|start|steal|stuff|suggest|suppose|thing|think|try|understand|use|wait|wake|wish",
};

export const curatedTopics = Object.fromEntries(Object.entries(curatedTopicGroups).flatMap(([topic, words]) => words.split("|").map((word) => [word, topic])));
