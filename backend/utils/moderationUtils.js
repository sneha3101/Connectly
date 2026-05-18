// Basic keyword-based moderation
const HARMFUL_KEYWORDS = [
  'abuse', 'attack', 'bomb', 'hate', 'kill', 'suicide',
  'violence', 'illegal', 'drug', 'weapon', 'rape', 'harass',
  'threat', 'hurt', 'damage', 'destroy', 'curse', 'racist',
  'sexist', 'offensive', 'discriminate'
];

const checkMessageSafety = (messageText) => {
  const lowerText = messageText.toLowerCase();
  
  for (const keyword of HARMFUL_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return {
        isSafe: false,
        reason: `Message contains harmful keyword: ${keyword}`
      };
    }
  }

  // Check for excessive special characters (spam)
  const specialCharRatio = (messageText.match(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/g) || []).length / messageText.length;
  if (specialCharRatio > 0.3) {
    return {
      isSafe: false,
      reason: 'Message contains excessive special characters (potential spam)'
    };
  }

  return {
    isSafe: true,
    reason: null
  };
};

const generateSmartReplies = (messageText) => {
  const replies = [
    'Got it!',
    'Interesting!',
    'Tell me more',
    'I agree!',
    'Thanks for sharing',
    'Makes sense',
    'Absolutely!',
    'I see what you mean'
  ];

  // Randomly select 3 smart replies
  const shuffled = replies.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

module.exports = { checkMessageSafety, generateSmartReplies };
