export const IDENTITIES = [
  { name: 'Twink', description: 'Smooth, slender, and effortlessly charming' },
  { name: 'Bear', description: 'Big, hairy, and giving teddy vibes' },
  { name: 'Hunk', description: 'Built like a snack and knows it' },
  { name: 'Chub', description: 'Soft, cuddly, and unapologetically thicc' },
  { name: 'Daddy', description: 'Mature, confident, and in control' },
  { name: 'Pup', description: 'Playful, energetic, and eager to please' },
  { name: 'Jock', description: 'Athletic, competitive, and ready to win' },
  { name: 'Brat', description: 'Mouthy, defiant, and living for chaos' },
  { name: 'Himbo', description: 'Hot, sweet, and not overthinking it' },
  { name: 'Sub', description: 'Obedient, service-oriented, and loving it' },
] as const;

export type IdentityName = typeof IDENTITIES[number]['name'];

export const POWER_CARDS = {
  PASS: {
    type: 'pass' as const,
    name: 'Pass That Bitch',
    description: 'Skip your dare before identity draw',
    count: 2,
  },
  TRANSFER: {
    type: 'transfer' as const,
    name: "You're That Bitch",
    description: 'Transfer your dare to another player',
    count: 1,
  },
  CHALLENGE: {
    type: 'challenge' as const,
    name: 'Challenge That Bitch',
    description: "Take over someone's dare. Winner takes one card.",
    count: 1,
  },
  LEFT_RIGHT: {
    type: 'left_right' as const,
    name: 'Left / Right That Bitch',
    description: 'Pass dare to left or right player',
    count: 1,
  },
  SECRET_TRIGGER: {
    type: 'secret_trigger' as const,
    name: 'Secret Dare Trigger',
    description: 'Force a random secret dare',
    count: 1,
  },
  FLIP: {
    type: 'flip' as const,
    name: 'Flip That Bitch',
    description: 'If someone transfers a dare to you, flip it back',
    count: 1,
  },
} as const;

export type CardType = 'pass' | 'transfer' | 'challenge' | 'left_right' | 'secret_trigger' | 'flip';

export const CATEGORIES = [
  { name: 'DRY', color: '#FFD700', description: 'Funny / Silly dares' },
  { name: 'WET', color: '#FF69B4', description: 'Dirty / Flirty dares' },
  { name: 'SLIPPERY', color: '#FF1493', description: 'Bold / Extreme dares' },
  { name: 'FOREPLAY', color: '#9D4EDD', description: 'Truth questions' },
] as const;

export type CategoryType = 'dry' | 'wet' | 'slippery' | 'foreplay';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;

export const CODE_OF_PLAY = [
  'Participation is optional. Pressure is not.',
  'No shaming. No judgment.',
  'The game chooses — not popularity.',
  'Passes are strategy, not weakness.',
  'Respect boundaries instantly.',
  'No manipulation.',
  'We escalate together.',
  'What happens here stays here.',
];
