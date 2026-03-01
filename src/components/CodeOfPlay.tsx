import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useGame } from '../contexts/GameContext';
import { CODE_OF_PLAY } from '../lib/gameConstants';

interface CodeOfPlayProps {
  onAllAgreed: () => void;
}

export default function CodeOfPlay({ onAllAgreed }: CodeOfPlayProps) {
  const { playerId, players, currentPlayer } = useGame();
  const [agreeing, setAgreeing] = useState(false);

  const handleAgree = async () => {
    if (!playerId) return;

    setAgreeing(true);
    await supabase
      .from('players')
      .update({ agreed_to_code: true })
      .eq('id', playerId);
    setAgreeing(false);
  };

  const allAgreed = players.length > 0 && players.every(p => p.agreed_to_code);
  const hasAgreed = currentPlayer?.agreed_to_code || false;

  if (allAgreed) {
    onAllAgreed();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-4">
            LUBE CODE OF PLAY
          </h1>
          <p className="text-gray-400">Everyone must agree before we start</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <div className="space-y-4 mb-8">
            {CODE_OF_PLAY.map((rule, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700"
              >
                <span className="text-2xl font-bold text-pink-500 flex-shrink-0">
                  {index + 1}.
                </span>
                <p className="text-lg text-gray-200 pt-1">{rule}</p>
              </div>
            ))}
          </div>

          {!hasAgreed ? (
            <button
              onClick={handleAgree}
              disabled={agreeing}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {agreeing ? 'Agreeing...' : 'I Agree'}
            </button>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700 text-green-200 px-6 py-3 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">You've agreed</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Players Status</h3>
          <div className="grid grid-cols-2 gap-3">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  player.agreed_to_code
                    ? 'bg-green-900/30 border border-green-700'
                    : 'bg-gray-700/30 border border-gray-600'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    player.agreed_to_code ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                />
                <span className="text-sm text-gray-200">{player.nickname}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
