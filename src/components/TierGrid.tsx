import React, { useState } from 'react';
import { Trophy, Shield, ChevronDown, Monitor, Smartphone, Gamepad } from 'lucide-react';
import { useGamemodeTiers } from '@/hooks/useGamemodeTiers';
import { GameMode } from '@/services/playerService';
import { Button } from '@/components/ui/button';
import { toDatabaseGameMode } from '@/utils/gamemodeCasing';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';

interface TierGridProps {
  selectedMode: string;
  onPlayerClick: (player: any) => void;
}

// Helper to get device icon
const getDeviceIcon = (device: string = 'PC') => {
  switch(device?.toLowerCase()) {
    case 'mobile':
    case 'bedrock':
      return <Smartphone className="w-3 h-3 text-blue-400" />;
    case 'console':
      return <Gamepad className="w-3 h-3 text-green-400" />;
    case 'pc':
    case 'java':
    default:
      return <Monitor className="w-3 h-3 text-white/80" />;
  }
};

// Get trophy icon for each tier
const getTierTrophyIcon = (tier: number) => {
  switch(tier) {
    case 1:
      return '/lovable-uploads/37ce4c39-65de-488b-9b54-729d03a47f8a.png';
    case 2:
      return '/lovable-uploads/16fabd70-8acd-4cea-a2a6-e3f5ea20c896.png';
    case 3:
      return '/lovable-uploads/74c2b79b-9e89-481e-aae1-6c980d7f2a4f.png';
    default:
      return null;
  }
};

// Get tier background colors to match your reference
const getTierColors = (tier: number) => {
  switch(tier) {
    case 1:
      return {
        bg: 'bg-gradient-to-r from-yellow-600/80 to-yellow-700/80',
        border: 'border-yellow-500/50',
        text: 'text-yellow-200'
      };
    case 2:
      return {
        bg: 'bg-gradient-to-r from-gray-500/80 to-gray-600/80',
        border: 'border-gray-400/50',
        text: 'text-gray-200'
      };
    case 3:
      return {
        bg: 'bg-gradient-to-r from-orange-600/80 to-orange-700/80',
        border: 'border-orange-500/50',
        text: 'text-orange-200'
      };
    case 4:
      return {
        bg: 'bg-gradient-to-r from-blue-600/60 to-blue-700/60',
        border: 'border-blue-500/40',
        text: 'text-blue-200'
      };
    case 5:
      return {
        bg: 'bg-gradient-to-r from-purple-600/60 to-purple-700/60',
        border: 'border-purple-500/40',
        text: 'text-purple-200'
      };
    default:
      return {
        bg: 'bg-gradient-to-r from-gray-700/60 to-gray-800/60',
        border: 'border-gray-500/40',
        text: 'text-gray-200'
      };
  }
};

export function TierGrid({ selectedMode, onPlayerClick }: TierGridProps) {
  const databaseGameMode = toDatabaseGameMode(selectedMode);
  const { tierData, loading, error } = useGamemodeTiers(databaseGameMode);
  
  const [tierVisibility, setTierVisibility] = useState({
    1: { count: 10, loadMore: true },
    2: { count: 10, loadMore: true },
    3: { count: 10, loadMore: true },
    4: { count: 10, loadMore: true },
    5: { count: 10, loadMore: true },
    retired: { count: 10, loadMore: true }
  });
  
  const [showRetired, setShowRetired] = useState(false);
  
  const loadMoreForTier = (tier: number | 'retired') => {
    setTierVisibility(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        count: prev[tier].count + 10,
      }
    }));
  };
  
  const tiers = [1, 2, 3, 4, 5];
  
  return (
    <div className="px-6 pb-8">
      <div className="flex justify-end mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRetired(!showRetired)}
          className="text-sm font-medium px-4 py-2"
        >
          {showRetired ? "Hide Retired Players" : "Show Retired Players"}
        </Button>
      </div>
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {tiers.map((tier) => {
            const highTierKey = `HT${tier}` as keyof typeof tierData;
            const lowTierKey = `LT${tier}` as keyof typeof tierData;
            const highTierPlayers = tierData[highTierKey] || [];
            const lowTierPlayers = tierData[lowTierKey] || [];
            
            const sortedPlayers = [...highTierPlayers, ...lowTierPlayers]
              .map(player => ({
                ...player,
                subtier: highTierPlayers.some(p => p.id === player.id) ? 'High' : 'Low',
              }))
              .sort((a, b) => {
                const pointsA = typeof a.global_points === 'string' 
                  ? parseFloat(a.global_points) 
                  : (a.global_points || 0);
                const pointsB = typeof b.global_points === 'string' 
                  ? parseFloat(b.global_points) 
                  : (b.global_points || 0);
                return pointsB - pointsA;
              });
              
            const visibleCount = tierVisibility[tier].count;
            const visiblePlayers = sortedPlayers.slice(0, visibleCount);
            const hasMore = sortedPlayers.length > visibleCount;
            const colors = getTierColors(tier);
            const trophyIcon = getTierTrophyIcon(tier);
            
            return (
              <div key={tier} className="tier-column">
                <div className="bg-[#2a3441] rounded-lg overflow-hidden border border-white/10 h-full shadow-lg">
                  {/* Tier Header - Compact */}
                  <div className={`${colors.bg} ${colors.border} border-b py-2 px-3`}>
                    <div className="flex items-center justify-center gap-2">
                      {trophyIcon ? (
                        <img 
                          src={trophyIcon} 
                          alt={`Tier ${tier} trophy`} 
                          className="w-5 h-5"
                        />
                      ) : (
                        <Trophy className="w-4 h-4 text-gray-400" />
                      )}
                      <h3 className={`${colors.text} font-bold text-sm`}>
                        Tier {tier}
                      </h3>
                    </div>
                    <div className="flex items-center justify-center text-xs text-white/60 mt-0.5">
                      <Shield size={10} className="mr-1" />
                      {sortedPlayers.length} players
                    </div>
                  </div>
                  
                  {/* Players List */}
                  {visiblePlayers.length > 0 ? (
                    <div className="space-y-0">
                      <div className="divide-y divide-white/5">
                        {visiblePlayers.map((player, index) => {
                          return (
                            <div
                              key={player.id}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                              onClick={() => onPlayerClick(player)}
                            >
                              <div className="relative">
                                <div className="w-8 h-8 rounded-md overflow-hidden border border-white/20 bg-gray-700">
                                  <img 
                                    src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                                    alt={player.ign}
                                    className="w-full h-full object-cover"
                                    onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-0.5">
                                  {getDeviceIcon(player.device)}
                                  <span className="text-xs font-medium text-white truncate">{player.ign}</span>
                                </div>
                                <span className={`text-xs ${
                                  player.subtier === 'High' ? colors.text : 'text-white/40'
                                }`}>
                                  {player.subtier === 'High' ? `HT${tier}` : `LT${tier}`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        
                        {hasMore && (
                          <div className="py-2 text-center">
                            <Button 
                              variant="ghost" 
                              onClick={() => loadMoreForTier(tier)}
                              size="sm"
                              className="text-sm flex items-center gap-1 text-white/70 hover:text-white h-7 px-3 font-medium"
                            >
                              Load More <ChevronDown size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3 text-white/30 text-sm">
                      No players in this tier
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Retired Players Section */}
      {showRetired && (
        <div className="mt-8 pt-4 border-t border-white/10 max-w-7xl mx-auto">
          <h2 className="text-lg font-bold mb-4 text-gray-400">Retired Players</h2>
          
          <div className="bg-[#2a3441] rounded-lg overflow-hidden border border-white/10 shadow-lg">
            <div className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 border-b border-gray-500/40 py-2 px-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-200 font-bold text-base flex items-center">
                  <Trophy className="mr-2" size={18} />
                  RETIRED
                </h3>
                <div className="flex items-center text-sm text-white/40">
                  <Shield size={14} className="mr-1" />
                  {(tierData["Retired"] || []).length}
                </div>
              </div>
            </div>
            
            {tierData["Retired"] && tierData["Retired"].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-white/5">
                {tierData["Retired"]
                  .slice(0, tierVisibility.retired.count)
                  .map((player) => {
                    return (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                        onClick={() => onPlayerClick(player)}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-md overflow-hidden border border-white/20 bg-gray-700">
                            <img 
                              src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                              alt={player.ign}
                              className="w-full h-full object-cover"
                              onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-0.5">
                            {getDeviceIcon(player.device)}
                            <span className="text-sm font-medium">{player.ign}</span>
                          </div>
                          <span className="text-sm text-gray-400">Retired Player</span>
                        </div>
                      </div>
                    );
                  })}
                
                {tierData["Retired"] && 
                 tierData["Retired"].length > tierVisibility.retired.count && (
                  <div className="py-3 text-center col-span-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => loadMoreForTier('retired')}
                      size="sm"
                      className="text-sm flex items-center gap-1 h-8 px-4 font-medium"
                    >
                      Load More <ChevronDown size={14} />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-white/20 text-sm">
                No retired players in this gamemode
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
