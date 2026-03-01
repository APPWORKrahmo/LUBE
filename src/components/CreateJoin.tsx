import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateRoomCode } from '../lib/gameUtils';
import { useGame } from '../contexts/GameContext';

interface CreateJoinProps {
  onRoomCreated: () => void;
}

export default function CreateJoin({ onRoomCreated }: CreateJoinProps) {
  const { setPlayerId, setRoomCode } = useGame();
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const code = generateRoomCode();

      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .insert({
          room_code: code,
          status: 'lobby',
        })
        .select()
        .single();

      if (roomError) throw roomError;

      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .insert({
          room_code: code,
          nickname: nickname.trim(),
          is_host: true,
          position: 0,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      await supabase
        .from('rooms')
        .update({ host_id: playerData.id })
        .eq('room_code', code);

      setPlayerId(playerData.id);
      setRoomCode(code);
      onRoomCreated();
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }

    if (!joinCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', joinCode.toUpperCase())
        .maybeSingle();

      if (roomError) throw roomError;
      if (!roomData) {
        setError('Room not found');
        setLoading(false);
        return;
      }

      if (roomData.status !== 'lobby') {
        setError('This game has already started');
        setLoading(false);
        return;
      }

      const { data: playersData } = await supabase
        .from('players')
        .select('position')
        .eq('room_code', joinCode.toUpperCase())
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = playersData && playersData.length > 0
        ? (playersData[0].position || 0) + 1
        : 0;

      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .insert({
          room_code: joinCode.toUpperCase(),
          nickname: nickname.trim(),
          is_host: false,
          position: nextPosition,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      setPlayerId(playerData.id);
      setRoomCode(joinCode.toUpperCase());
      onRoomCreated();
    } catch (err) {
      setError('Failed to join room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              LUBE
            </h1>
            <p className="text-xl text-gray-300 font-light tracking-wide">
              All evenings need a little lubrication.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Create Room
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            {mode === 'create' ? 'Create Room' : 'Join Room'}
          </h1>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {mode === 'join' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setMode('menu')}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={mode === 'create' ? handleCreateRoom : handleJoinRoom}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : mode === 'create' ? 'Create' : 'Join'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
