
import React from 'react';
import { cn } from '@/lib/utils';
import { GameModeIcon } from './GameModeIcon';

interface GameModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

export function GameModeSelector({ selectedMode = 'overall', onSelectMode }: GameModeSelectorProps) {
  // Define all game modes
  const gameModes = [
    { id: 'overall', label: 'Overall' },
    { id: 'crystal', label: 'Crystal' },
    { id: 'sword', label: 'Sword' },
    { id: 'axe', label: 'Axe' },
    { id: 'mace', label: 'Mace' },
    { id: 'smp', label: 'SMP' },
    { id: 'nethpot', label: 'NethPot' },
    { id: 'bedwars', label: 'Bedwars' },
    { id: 'uhc', label: 'UHC' }
  ];
  
  const currentMode = selectedMode?.toLowerCase() || 'overall';
  
  return (
    <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
      {gameModes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={cn(
            // Slightly larger sizing as requested - only UI change allowed
            "flex items-center justify-center rounded-md whitespace-nowrap border transition-colors duration-150",
            "text-sm px-3 py-2", // Increased from px-2 py-1 for mobile
            "md:text-base md:px-4 md:py-2", // Increased from md:text-sm md:px-3 md:py-1.5
            "lg:text-base lg:px-4 lg:py-2", // Increased from lg:text-sm lg:px-3 lg:py-1.5
            "font-medium",
            mode.id === 'overall' ? "" : "",
            currentMode === mode.id 
              ? "bg-white/10 border-white/20 text-white" 
              : "bg-white/5 border-white/5 text-white/60 hover:bg-white/8 hover:text-white/80"
          )}
        >
          {mode.id !== 'overall' && (
            <GameModeIcon 
              mode={mode.id} 
              // Slightly larger icons to match button size
              className="h-4 w-4 mr-1.5 md:h-5 md:w-5 md:mr-2 lg:h-5 lg:w-5 lg:mr-2" 
            />
          )}
          {mode.label}
        </button>
      ))}
    </div>
  );
}
