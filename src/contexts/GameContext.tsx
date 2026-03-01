import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Room = Database['public']['Tables']['rooms']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type PlayerCard = Database['public']['Tables']['player_cards']['Row'];

interface GameContextType {
  playerId: string | null;
  setPlayerId: (id: string | null) => void;
  roomCode: string | null;
  setRoomCode: (code: string | null) => void;
  room: Room | null;
  players: Player[];
  currentPlayer: Player | null;
  myCards: PlayerCard[];
  refreshRoom: () => Promise<void>;
  refreshPlayers: () => Promise<void>;
  refreshMyCards: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [playerId, setPlayerId] = useState<string | null>(
    localStorage.getItem('playerId')
  );
  const [roomCode, setRoomCode] = useState<string | null>(
    localStorage.getItem('roomCode')
  );
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myCards, setMyCards] = useState<PlayerCard[]>([]);

  const currentPlayer = players.find(p => p.id === playerId) || null;

  const refreshRoom = async () => {
    if (!roomCode) return;

    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode)
      .maybeSingle();

    if (data) setRoom(data);
  };

  const refreshPlayers = async () => {
    if (!roomCode) return;

    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('room_code', roomCode)
      .order('position', { ascending: true });

    if (data) setPlayers(data);
  };

  const refreshMyCards = async () => {
    if (!playerId) return;

    const { data } = await supabase
      .from('player_cards')
      .select('*')
      .eq('player_id', playerId)
      .eq('used', false);

    if (data) setMyCards(data);
  };

  useEffect(() => {
    if (playerId) {
      localStorage.setItem('playerId', playerId);
    } else {
      localStorage.removeItem('playerId');
    }
  }, [playerId]);

  useEffect(() => {
    if (roomCode) {
      localStorage.setItem('roomCode', roomCode);
    } else {
      localStorage.removeItem('roomCode');
    }
  }, [roomCode]);

  useEffect(() => {
    if (roomCode) {
      refreshRoom();
      refreshPlayers();
    }
  }, [roomCode]);

  useEffect(() => {
    if (playerId) {
      refreshMyCards();
    }
  }, [playerId]);

  useEffect(() => {
    if (!roomCode) return;

    const roomChannel = supabase
      .channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `room_code=eq.${roomCode}`,
        },
        () => refreshRoom()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_code=eq.${roomCode}`,
        },
        () => refreshPlayers()
      )
      .subscribe();

    return () => {
      roomChannel.unsubscribe();
    };
  }, [roomCode]);

  useEffect(() => {
    if (!playerId) return;

    const cardsChannel = supabase
      .channel(`player_cards:${playerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_cards',
          filter: `player_id=eq.${playerId}`,
        },
        () => refreshMyCards()
      )
      .subscribe();

    return () => {
      cardsChannel.unsubscribe();
    };
  }, [playerId]);

  return (
    <GameContext.Provider
      value={{
        playerId,
        setPlayerId,
        roomCode,
        setRoomCode,
        room,
        players,
        currentPlayer,
        myCards,
        refreshRoom,
        refreshPlayers,
        refreshMyCards,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
