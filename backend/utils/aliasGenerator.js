const adjectives = [
  'Happy', 'Bright', 'Clever', 'Swift', 'Bold', 'Calm', 'Keen', 'Noble',
  'Vivid', 'Witty', 'Gentle', 'Brave', 'Smart', 'Quick', 'Warm', 'Cool',
  'Epic', 'Mighty', 'Nice', 'Rare', 'Pure', 'True', 'Free', 'Fair'
];

const nouns = [
  'Tiger', 'Eagle', 'Phoenix', 'Dragon', 'Wolf', 'Lion', 'Hawk', 'Bear',
  'Fox', 'Raven', 'Deer', 'Panda', 'Otter', 'Salmon', 'Dolphin', 'Owl',
  'Swan', 'Falcon', 'Puma', 'Lynx', 'Jaguar', 'Snowy', 'Cosmic', 'Star'
];

const generateAlias = () => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

module.exports = { generateAlias };
