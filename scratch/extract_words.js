import fs from 'fs';
import path from 'path';

const dir = './src/data/ket-words';
const files = fs.readdirSync(dir).filter(f => f.startsWith('level-') && f.endsWith('.js'));

const wordsByTopic = {};
let totalWords = 0;

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Match word blocks or just lines with "word": "..." and "topic": "..."
  // Since the files are JSON-like objects in JS arrays, we can parse them by splitting or regex.
  // Let's do regex for word and topic.
  const wordRegex = /"word":\s*"([^"]+)"/g;
  const topicRegex = /"topic":\s*"([^"]+)"/g;
  
  const words = [];
  let match;
  while ((match = wordRegex.exec(content)) !== null) {
    words.push(match[1]);
  }
  
  const topics = [];
  while ((match = topicRegex.exec(content)) !== null) {
    topics.push(match[1]);
  }
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const topic = topics[i] || 'unknown';
    if (!wordsByTopic[topic]) {
      wordsByTopic[topic] = [];
    }
    if (!wordsByTopic[topic].includes(word)) {
      wordsByTopic[topic].push(word);
    }
    totalWords++;
  }
});

fs.writeFileSync('scratch/words_by_topic.json', JSON.stringify(wordsByTopic, null, 2));
console.log('Total words extracted:', totalWords);
console.log('Topics count:', Object.keys(wordsByTopic).length);
