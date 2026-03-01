import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';
import { getRandomIdentities, getInitialPowerCards } from '../lib/gameUtils';
import { MIN_PLAYERS, MAX_PLAYERS } from '../lib/gameConstants';

export default function Lobby() {
  const { roomCode, players, currentPlayer, room } = useGame();
  const [starting, setStarting] = useState(false);

  const isHost = currentPlayer?.is_host || false;
  const canStart = players.length >= MIN_PLAYERS && players.length <= MAX_PLAYERS;

  const handleStartGame = async () => {
    if (!roomCode || !canStart) return;

    setStarting(true);

    try {
      const identities = getRandomIdentities(players.length);
      const identityPool = [...identities];

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        await supabase
          .from('players')
          .update({ identity: identities[i] })
          .eq('id', player.id);

        const powerCards = getInitialPowerCards();
        const cardsToInsert = powerCards.map(card => ({
          player_id: player.id,
          card_type: card.type,
          used: false,
        }));

        await supabase.from('player_cards').insert(cardsToInsert);
      }

      await supabase
        .from('rooms')
        .update({
          status: 'game_active',
          current_player_id: players[0].id,
          identity_pool: identityPool,
        })
        .eq('room_code', roomCode);
    } catch (err) {
      console.error('Failed to start game:', err);
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            LUBE
          </h1>
          <div className="inline-block bg-gray-800 border border-gray-700 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-400">Room Code</p>
            <p className="text-3xl font-bold text-white tracking-wider">{roomCode}</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Players ({players.length}/{MAX_PLAYERS})
            </h2>
            {isHost && (
              <span className="bg-pink-500/20 border border-pink-500 text-pink-300 px-3 py-1 rounded-full text-sm font-semibold">
                You're Host
              </span>
            )}
          </div>

          <div className="space-y-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-pink-500">
                    {index + 1}
                  </span>
                  <span className="text-lg text-white">{player.nickname}</span>
                </div>
                {player.is_host && (
                  <span className="bg-purple-500/20 border border-purple-500 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                    HOST
                  </span>
                )}
              </div>
            ))}
          </div>

          {players.length < MIN_PLAYERS && (
            <div className="mt-4 bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg text-sm">
              Need at least {MIN_PLAYERS} players to start
            </div>
          )}
        </div>

        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={!canStart || starting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {starting ? 'Starting Game...' : 'Start Game'}
          </button>
        )}

        {!isHost && (
          <div className="text-center text-gray-400 py-4">
            Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  );
}
