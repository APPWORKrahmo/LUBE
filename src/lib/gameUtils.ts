import { IDENTITIES, POWER_CARDS } from './gameConstants';

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getInitialPowerCards(): Array<{ type: string; count: number }> {
  const cards: Array<{ type: string; count: number }> = [];

  Object.values(POWER_CARDS).forEach(card => {
    for (let i = 0; i < card.count; i++) {
      cards.push({ type: card.type, count: 1 });
    }
  });

  return cards;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomIdentities(count: number): string[] {
  const shuffled = shuffleArray([...IDENTITIES]);
  return shuffled.slice(0, count).map(id => id.name);
}

export function getIdentityDescription(name: string): string {
  const identity = IDENTITIES.find(id => id.name === name);
  return identity?.description || '';
}
