import { useGame } from '../contexts/GameContext';
import { POWER_CARDS } from '../lib/gameConstants';

interface PowerCardsProps {
  onCardSelected?: (cardId: string, cardType: string) => void;
  selectable?: boolean;
}

export default function PowerCards({ onCardSelected, selectable }: PowerCardsProps) {
  const { myCards } = useGame();

  const getCardInfo = (cardType: string) => {
    const cardKey = Object.keys(POWER_CARDS).find(
      key => POWER_CARDS[key as keyof typeof POWER_CARDS].type === cardType
    );
    if (cardKey) {
      return POWER_CARDS[cardKey as keyof typeof POWER_CARDS];
    }
    return null;
  };

  const groupedCards = myCards.reduce((acc, card) => {
    if (!acc[card.card_type]) {
      acc[card.card_type] = [];
    }
    acc[card.card_type].push(card);
    return acc;
  }, {} as Record<string, typeof myCards>);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-3">Your Power Cards</h2>
      {myCards.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-red-400 font-semibold mb-2">NO CARDS LEFT</p>
          <p className="text-sm text-gray-400">You must accept all dares</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(groupedCards).map(([cardType, cards]) => {
            const cardInfo = getCardInfo(cardType);
            if (!cardInfo) return null;

            return (
              <div
                key={cardType}
                onClick={() => selectable && onCardSelected?.(cards[0].id, cardType)}
                className={`bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-500/50 rounded-lg p-4 ${
                  selectable
                    ? 'cursor-pointer hover:border-pink-400 hover:scale-105 transition-all'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-pink-300">{cardInfo.name}</h3>
                  <span className="bg-pink-500/30 border border-pink-500 text-pink-200 px-2 py-0.5 rounded-full text-xs font-bold">
                    ×{cards.length}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{cardInfo.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
