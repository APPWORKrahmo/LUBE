import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';
import PlayerDashboard from './PlayerDashboard';
import SpinWheel from './SpinWheel';
import PowerCards from './PowerCards';
import { ChevronRight, Trophy } from 'lucide-react';

export default function GameScreen() {
  const { room, players, currentPlayer, playerId, roomCode, myCards, refreshRoom } = useGame();
  const [gamePhase, setGamePhase] = useState<'spin' | 'decide' | 'dare_shown' | 'identity_draw'>('spin');
  const [selectedCard, setSelectedCard] = useState<{ id: string; type: string } | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const isMyTurn = room?.current_player_id === playerId;
  const currentDare = room?.current_dare as { text: string } | null;
  const currentCategory = room?.current_category;

  const handleSpinComplete = async (category: string) => {
    const { data: contentData } = await supabase
      .from('content')
      .select('*')
      .eq('category', category);

    if (contentData && contentData.length > 0) {
      const randomDare = contentData[Math.floor(Math.random() * contentData.length)];

      await supabase
        .from('rooms')
        .update({
          current_category: category,
          current_dare: { text: randomDare.text },
        })
        .eq('room_code', roomCode!);

      setGamePhase('decide');
    }
  };

  const handleAcceptDare = async () => {
    setGamePhase('identity_draw');

    const identityPool = (room?.identity_pool as string[]) || [];
    if (identityPool.length === 0) return;

    const randomIndex = Math.floor(Math.random() * identityPool.length);
    const drawnIdentity = identityPool[randomIndex];

    const targetPlayer = players.find(p => p.identity === drawnIdentity);

    setTimeout(async () => {
      alert(`${drawnIdentity} must complete this dare!\n\nThat's ${targetPlayer?.nickname}!`);
      await moveToNextPlayer();
    }, 1000);
  };

  const handlePlayCard = async (cardId: string, cardType: string) => {
    setSelectedCard({ id: cardId, type: cardType });

    await supabase
      .from('player_cards')
      .update({ used: true })
      .eq('id', cardId);

    await supabase
      .from('players')
      .update({ cards_remaining: myCards.length - 1 })
      .eq('id', playerId!);

    if (cardType === 'pass') {
      alert('You passed this dare!');
      await moveToNextPlayer();
    } else if (cardType === 'transfer') {
      alert('Transfer card played! (Transfer logic would go here)');
      await moveToNextPlayer();
    } else if (cardType === 'left_right') {
      alert('Left/Right card played! (Direction logic would go here)');
      await moveToNextPlayer();
    } else {
      await moveToNextPlayer();
    }
  };

  const moveToNextPlayer = async () => {
    const currentIndex = players.findIndex(p => p.id === room?.current_player_id);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayer = players[nextIndex];

    await supabase
      .from('rooms')
      .update({
        current_player_id: nextPlayer.id,
        current_dare: null,
        current_category: null,
      })
      .eq('room_code', roomCode!);

    setGamePhase('spin');
    setSelectedCard(null);
  };

  if (showLeaderboard) {
    const sortedPlayers = [...players].sort((a, b) => b.cards_remaining - a.cards_remaining);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
        <div className="max-w-2xl mx-auto py-8 space-y-6">
          <div className="text-center">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-4">
              LEADERBOARD
            </h1>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-2 border-yellow-500'
                    : 'bg-gray-900/50 border border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-pink-500">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-white text-lg">{player.nickname}</p>
                    <p className="text-sm text-gray-400">{player.identity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{player.cards_remaining}</p>
                  <p className="text-xs text-gray-400">cards</p>
                </div>
                {index === 0 && <Trophy className="w-8 h-8 text-yellow-500" />}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowLeaderboard(false)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Back to Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            LUBE
          </h1>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Trophy className="w-5 h-5" />
            Leaderboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PlayerDashboard />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {gamePhase === 'spin' && isMyTurn && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                  Your Turn! Spin the Wheel
                </h2>
                <SpinWheel onSpinComplete={handleSpinComplete} />
              </div>
            )}

            {gamePhase === 'spin' && !isMyTurn && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Waiting for {players.find(p => p.id === room?.current_player_id)?.nickname} to spin...
                </h2>
              </div>
            )}

            {(gamePhase === 'decide' || gamePhase === 'dare_shown') && currentDare && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                <div className="mb-6">
                  <div
                    className="inline-block px-4 py-2 rounded-lg text-sm font-bold mb-4"
                    style={{
                      backgroundColor: currentCategory === 'dry' ? '#FFD700' :
                                     currentCategory === 'wet' ? '#FF69B4' :
                                     currentCategory === 'slippery' ? '#FF1493' : '#9D4EDD',
                      color: '#000',
                    }}
                  >
                    {currentCategory?.toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">{currentDare.text}</h2>
                </div>

                {isMyTurn && gamePhase === 'decide' && (
                  <div className="space-y-4">
                    <p className="text-gray-300 mb-4">
                      Choose to accept or play a power card (you won't know who gets it until you accept)
                    </p>

                    <button
                      onClick={handleAcceptDare}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all"
                    >
                      Accept Dare
                    </button>

                    {myCards.length > 0 && (
                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-400 mb-3">Or play a power card:</p>
                        <PowerCards
                          selectable
                          onCardSelected={handlePlayCard}
                        />
                      </div>
                    )}
                  </div>
                )}

                {!isMyTurn && (
                  <p className="text-gray-400 text-center">
                    Waiting for {players.find(p => p.id === room?.current_player_id)?.nickname} to decide...
                  </p>
                )}
              </div>
            )}

            {!isMyTurn && (
              <PowerCards />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
