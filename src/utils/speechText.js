export function getSpeakableWordText(wordOrText) {
  const rawText = typeof wordOrText === 'string'
    ? wordOrText
    : wordOrText?.speechText || wordOrText?.word || '';

  return rawText
    .replace(/\s*\/\s*/g, ' or ')
    .replace(/[‘’]/g, "'")
    .replace(/\(([^)]*)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
