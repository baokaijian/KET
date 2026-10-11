/**
 * Utility to generate dual UK (英英) and US (美英) phonetic symbols for KET words.
 * Uses phonetic transformation rules and custom overrides for exceptions.
 */

const phoneticOverrides = {
  // Common vocabulary exceptions with unique US/UK pronunciation differences
  tomato: { uk: '/təˈmɑːtəʊ/', us: '/təˈmeɪtoʊ/' },
  potato: { uk: '/pəˈteɪtəʊ/', us: '/pəˈteɪtoʊ/' },
  banana: { uk: '/bəˈnɑːnə/', us: '/bəˈnænə/' },
  giraffe: { uk: '/dʒɪˈrɑːf/', us: '/dʒɪˈræf/' },
  water: { uk: '/ˈwɔːtə/', us: '/ˈwɔːtər/' },
  either: { uk: '/ˈaɪðə/', us: '/ˈiːðər/' },
  neither: { uk: '/ˈnaɪðə/', us: '/ˈniːðər/' },
  climb: { uk: '/klaɪm/', us: '/klaɪm/' },
  suit: { uk: '/suːt/', us: '/suːt/' },
  address: { uk: '/əˈdres/', us: '/ˈædres/' },
  route: { uk: '/ruːt/', us: '/raʊt/' },
  vase: { uk: '/vɑːz/', us: '/veɪs/' },
  class: { uk: '/klɑːs/', us: '/klæs/' },
  glass: { uk: '/ɡɑːs/', us: '/ɡlæs/' },
  grass: { uk: '/ɡrɑːs/', us: '/ɡræs/' },
  fast: { uk: '/fɑːst/', us: '/fæst/' },
  bath: { uk: '/bɑːθ/', us: '/bæθ/' },
  ask: { uk: '/ɑːsk/', us: '/æsk/' },
  answer: { uk: '/ˈɑːnsə/', us: '/ˈænsər/' },
  afternoon: { uk: '/ˌɑːftəˈnuːn/', us: '/ˌæftərˈnuːn/' },
  example: { uk: '/ɪɡˈzɑːmpl/', us: '/ɪɡˈzæmpl/' },
  can_t: { uk: '/kɑːnt/', us: '/kænt/' },
  "can't": { uk: '/kɑːnt/', us: '/kænt/' },
  chance: { uk: '/tʃɑːns/', us: '/tʃæns/' },
  dance: { uk: '/dɑːns/', us: '/dæns/' },
  half: { uk: '/hɑːf/', us: '/hæf/' },
  laugh: { uk: '/lɑːf/', us: '/læf/' },
  past: { uk: '/pɑːst/', us: '/pæst/' },
  plant: { uk: '/plɑːnt/', us: '/plænt/' },
  branch: { uk: '/brɑːntʃ/', us: '/bræntʃ/' },
  father: { uk: '/ˈfɑːðə/', us: '/ˈfɑːðər/' },
  mother: { uk: '/ˈmʌðə/', us: '/ˈmʌðər/' },
  brother: { uk: '/ˈbrʌðə/', us: '/ˈbrʌðər/' },
  sister: { uk: '/ˈsɪstə/', us: '/ˈsɪstər/' },
  teacher: { uk: '/ˈtiːtʃə/', us: '/ˈtiːtʃər/' },
  doctor: { uk: '/ˈdɒktə/', us: '/ˈdɑːktər/' },
  actor: { uk: '/ˈæktə/', us: '/ˈæktər/' },
  driver: { uk: '/ˈdraɪvə/', us: '/ˈdraɪvər/' },
  worker: { uk: '/ˈwɜːkə/', us: '/ˈwɜːrkər/' },
  computer: { uk: '/kəmˈpjuːtə/', us: '/kəmˈpjuːtər/' },
};

/**
 * Derives both UK and US phonetic symbols for a given word object.
 * 
 * @param {Object} wordObj - The word object containing `word` and `phonetic`.
 * @returns {Object} - An object with { uk, us } phonetic strings.
 */
export function getDualPhonetics(wordObj) {
  if (!wordObj || !wordObj.phonetic) {
    return { uk: '', us: '' };
  }

  const originalPhonetic = wordObj.phonetic.trim();
  const word = (wordObj.word || '').toLowerCase().trim();

  // Check direct overrides first
  if (phoneticOverrides[word]) {
    return phoneticOverrides[word];
  }

  // The base phonetic in the KET files is standard UK
  const uk = originalPhonetic;
  let us = originalPhonetic;

  // Apply general UK -> US phonetic mapping rules

  // 1. Final /ə/ in words ending in r-related suffixes -> /ər/
  // suffixes: -er, -or, -ar, -ur, -re, -eer, -our
  if (us.endsWith('ə/')) {
    if (
      word.endsWith('er') || word.endsWith('or') || word.endsWith('ar') ||
      word.endsWith('ur') || word.endsWith('re') || word.endsWith('our')
    ) {
      us = us.replace(/ə\/$/, 'ər/');
    }
  }

  // 2. Short /ɒ/ in US is usually /ɑː/ or /ɔː/ (e.g. box -> /bɑːks/, dog -> /dɔːɡ/)
  // Let's use /ɔː/ if followed by g, ng, ss, st, th, f, otherwise /ɑː/
  const shortOToAwSpellings = ['dog', 'song', 'long', 'lost', 'cost', 'off', 'soft', 'cloth', 'coffee', 'frog', 'wrong', 'boss', 'cross', 'shop', 'office'];
  if (us.includes('ɒ')) {
    const isAwSpelling = shortOToAwSpellings.some(pattern => word.includes(pattern));
    if (isAwSpelling) {
      us = us.replace(/ɒ/g, 'ɔː');
    } else {
      us = us.replace(/ɒ/g, 'ɑː');
    }
  }

  // 3. Vowels before 'r' spellings:
  // - /eə/ -> /er/ (bear -> /ber/, hair -> /her/)
  us = us.replace(/eə/g, 'er');

  // - /ɪə/ -> /ɪr/ (ear -> /ɪr/, near -> /nɪr/)
  us = us.replace(/ɪə/g, 'ɪr');

  // - /ʊə/ -> /ʊr/ (tour -> /tʊr/)
  us = us.replace(/ʊə/g, 'ʊr');

  // 4. Vowel /ɑː/:
  // - If the word has "ar" (car, park, garden), UK /ɑː/ -> US /ɑːr/
  // - If it has "a" followed by f/s/th/n (ask, class), UK /ɑː/ -> US /æ/ (already covered in overrides mostly, but we can do a general check)
  if (us.includes('ɑː')) {
    if (word.includes('ar')) {
      us = us.replace(/ɑː/g, 'ɑːr');
    } else if (
      word.includes('ast') || word.includes('ask') || word.includes('ass') ||
      word.includes('ath') || word.includes('ant') || word.includes('anc') ||
      word.includes('ans') || word.includes('aft')
    ) {
      us = us.replace(/ɑː/g, 'æ');
    }
  }

  // 5. Vowel /ɔː/:
  // - If the word has "or", "our", "oor", "oar", "war" (horse, morning, board, course, warm), UK /ɔː/ -> US /ɔːr/
  if (us.includes('ɔː')) {
    if (
      word.includes('or') || word.includes('our') || word.includes('oor') ||
      word.includes('oar') || word.includes('war')
    ) {
      us = us.replace(/ɔː/g, 'ɔːr');
    }
  }

  // 6. Vowel /ɜː/ (bird, shirt, learn, nurse): UK /ɜː/ -> US /ɜːr/
  if (us.includes('ɜː')) {
    us = us.replace(/ɜː/g, 'ɜːr');
  }

  // 7. Vowel /əʊ/ (go, window): UK /əʊ/ -> US /oʊ/
  us = us.replace(/əʊ/g, 'oʊ');

  return { uk, us };
}
