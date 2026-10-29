import React, { useEffect, useRef } from 'react';
import { SchoolGameEngine, InteractiveSpot } from '../game3d/GameEngine';
import { MissionId } from '../types/game';

interface GameCanvasProps {
  onEngineReady?: (engine: SchoolGameEngine) => void;
  onSpotChanged?: (spot: InteractiveSpot | null) => void;
  onInteractTriggered?: (spot: InteractiveSpot) => void;
  unlockedMissions: Set<MissionId>;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onEngineReady,
  onSpotChanged,
  onInteractTriggered,
  unlockedMissions
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SchoolGameEngine | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize 3D Engine once
    const engine = new SchoolGameEngine(mountRef.current);
    engineRef.current = engine;

    engine.onSpotChanged = onSpotChanged;
    engine.onInteractTriggered = onInteractTriggered;
    engine.unlockedMissions = unlockedMissions;

    if (onEngineReady) {
      onEngineReady(engine);
    }

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Update unlocked missions dynamically
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.unlockedMissions = unlockedMissions;
    }
  }, [unlockedMissions]);

  // Keep interaction callbacks fresh
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.onSpotChanged = onSpotChanged;
      engineRef.current.onInteractTriggered = onInteractTriggered;
    }
  }, [onSpotChanged, onInteractTriggered]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none outline-none"
      style={{ touchAction: 'none' }}
    />
  );
};
