import { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { useContentSeeder } from './hooks/useContentSeeder';
import AgeGate from './components/AgeGate';
import CreateJoin from './components/CreateJoin';
import CodeOfPlay from './components/CodeOfPlay';
import Lobby from './components/Lobby';
import GameScreen from './components/GameScreen';

function AppContent() {
  const [hasConfirmedAge, setHasConfirmedAge] = useState(false);
  const { room, players } = useGame();
  useContentSeeder();

  if (!hasConfirmedAge) {
    return <AgeGate onConfirm={() => setHasConfirmedAge(true)} />;
  }

  if (!room) {
    return <CreateJoin onRoomCreated={() => {}} />;
  }

  if (room.status === 'lobby') {
    const allAgreed = players.length > 0 && players.every(p => p.agreed_to_code);

    if (!allAgreed) {
      return <CodeOfPlay onAllAgreed={() => {}} />;
    }

    return <Lobby />;
  }

  if (room.status === 'game_active') {
    return <GameScreen />;
  }

  return <div>Loading...</div>;
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
