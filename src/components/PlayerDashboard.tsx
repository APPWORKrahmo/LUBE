import { useGame } from '../contexts/GameContext';
import { getIdentityDescription } from '../lib/gameUtils';
import { AlertCircle } from 'lucide-react';

export default function PlayerDashboard() {
  const { players, room, playerId } = useGame();

  const identityPool = (room?.identity_pool as string[]) || [];

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-bold text-white mb-3">Players</h2>
        <div className="space-y-2">
          {players.map((player) => {
            const isCurrentTurn = player.id === room?.current_player_id;
            const isMe = player.id === playerId;
            const isVulnerable = player.cards_remaining === 0;

            return (
              <div
                key={player.id}
                className={`border rounded-lg p-3 transition-all ${
                  isCurrentTurn
                    ? 'bg-pink-900/30 border-pink-500'
                    : 'bg-gray-900/50 border-gray-700'
                } ${isMe ? 'ring-2 ring-cyan-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{player.nickname}</span>
                    {isMe && (
                      <span className="bg-cyan-500/20 border border-cyan-500 text-cyan-300 px-2 py-0.5 rounded text-xs font-semibold">
                        YOU
                      </span>
                    )}
                    {isCurrentTurn && (
                      <span className="bg-pink-500/20 border border-pink-500 text-pink-300 px-2 py-0.5 rounded text-xs font-semibold">
                        TURN
                      </span>
                    )}
                  </div>
                </div>

                {player.identity && (
                  <div className="mb-2">
                    <div className="inline-block bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/50 px-3 py-1 rounded-lg">
                      <span className="font-bold text-pink-300 text-sm">
                        {player.identity}
                      </span>
                      <span className="text-gray-400 text-xs ml-2">
                        {getIdentityDescription(player.identity)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">Cards:</span>
                    <span className="font-bold text-white">
                      {player.cards_remaining}
                    </span>
                  </div>
                  {isVulnerable && (
                    <div className="flex items-center gap-1 bg-red-900/30 border border-red-700 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-300 font-semibold">
                        VULNERABLE
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-3">The Bitch Pile</h3>
        <p className="text-xs text-gray-400 mb-3">
          Random identities drawn from this pool
        </p>
        <div className="flex flex-wrap gap-2">
          {identityPool.map((identity, index) => (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-600 px-3 py-1 rounded-lg"
            >
              <span className="text-sm text-pink-400 font-semibold">
                {identity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
