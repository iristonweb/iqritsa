import { useEffect } from "react";
import "@fontsource/inter";
import GameHub from "./components/game/GameHub";
import PuzzleArea from "./components/game/PuzzleArea";
import { useIQGame } from "./lib/stores/useIQGame";
import { useGameAudio } from "./hooks/useGameAudio";
import "./index.css";

function App() {
  const { gameState, initializeGame } = useIQGame();
  const { initializeAudio } = useGameAudio();

  useEffect(() => {
    initializeGame();
    initializeAudio();
  }, [initializeGame, initializeAudio]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-sky-200 via-green-100 to-yellow-100 overflow-hidden">
      {/* Main Game UI */}
      <div className="relative z-10 w-full h-full">
        {gameState === 'hub' && <GameHub />}
        {gameState === 'puzzle' && <PuzzleArea />}
      </div>
    </div>
  );
}

export default App;
