import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameModeIcon } from './GameModeIcon';
import { Monitor, Smartphone, Gamepad, Crown, Star, Trophy } from 'lucide-react';
import { getPlayerRank } from '@/utils/rankUtils';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePopup } from '@/contexts/PopupContext';

interface MinecraftLeaderboardTableProps {
  players: Player[];
  onPlayerClick?: (player: Player) => void;
}

const getDeviceIcon = (device: string = 'PC') => {
  const iconProps = "w-4 h-4";
  switch(device?.toLowerCase()) {
    case 'mobile':
    case 'bedrock':
      return <Smartphone className={`${iconProps} text-blue-400`} />;
    case 'console':
      return <Gamepad className={`${iconProps} text-green-400`} />;
    case 'pc':
    case 'java':
    default:
      return <Monitor className={`${iconProps} text-white/90`} />;
  }
};

const getRegionStyling = (regionCode: string = 'NA') => {
  const regions: Record<string, { 
    bgColor: string;
    textColor: string;
    borderColor: string;
  }> = {
    'NA': { 
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-white',
      borderColor: 'border-red-400'
    },
    'EU': { 
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-white',
      borderColor: 'border-green-400'
    },
    'ASIA': { 
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-white',
      borderColor: 'border-blue-400'
    },
    'SA': { 
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-white',
      borderColor: 'border-orange-400'
    },
    'AF': { 
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-white',
      borderColor: 'border-purple-400'
    },
    'OCE': { 
      bgColor: 'bg-gradient-to-r from-teal-500 to-teal-600',
      textColor: 'text-white',
      borderColor: 'border-teal-400'
    }
  };
  
  return regions[regionCode] || regions['NA'];
};

const getRankBadgeStyle = (position: number) => {
  if (position === 1) {
    return {
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-900',
      icon: <Crown className="h-4 w-4" />
    };
  } else if (position === 2) {
    return {
      bgColor: 'bg-gray-400',
      textColor: 'text-gray-900',
      icon: <Trophy className="h-4 w-4" />
    };
  } else if (position === 3) {
    return {
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-900',
      icon: <Star className="h-4 w-4" />
    };
  } else {
    return {
      bgColor: 'bg-gray-700',
      textColor: 'text-white',
      icon: null
    };
  }
};

const getRankTooltip = (points: number) => {
  if (points >= 400) return "Combat Grandmaster - Obtained 400+ total points";
  if (points >= 250) return "Combat Master - Obtained 250+ total points";
  if (points >= 100) return "Combat Ace - Obtained 100+ total points";
  if (points >= 50) return "Combat Specialist - Obtained 50+ total points";
  if (points >= 20) return "Combat Cadet - Obtained 20+ total points";
  if (points >= 10) return "Combat Novice - Obtained 10+ total points";
  return "Rookie - Starting rank";
};

const getTierBadgeColor = (tier: string) => {
  const tierStyles = {
    'HT1': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-yellow-300',
    'HT2': 'bg-gradient-to-r from-orange-400 to-orange-500 text-black border-orange-300',
    'HT3': 'bg-gradient-to-r from-red-400 to-red-500 text-white border-red-300',
    'HT4': 'bg-gradient-to-r from-pink-400 to-pink-500 text-white border-pink-300',
    'HT5': 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border-purple-300',
    'LT1': 'bg-gradient-to-r from-green-400 to-green-500 text-black border-green-300',
    'LT2': 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-300',
    'LT3': 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black border-cyan-300',
    'LT4': 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white border-indigo-300',
    'LT5': 'bg-gradient-to-r from-teal-400 to-teal-500 text-black border-teal-300'
  };
  
  for (const [key, style] of Object.entries(tierStyles)) {
    if (tier.includes(key)) return style;
  }
  return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400';
};

const getPlayerTierForGamemode = (player: Player, gamemode: string): string => {
  if (!player.tierAssignments) return 'Not Ranked';
  
  const assignment = player.tierAssignments.find(
    t => t.gamemode.toLowerCase() === gamemode.toLowerCase()
  );
  
  return assignment?.tier || 'Not Ranked';
};

export const MinecraftLeaderboardTable: React.FC<MinecraftLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  const isMobile = useIsMobile();
  const { openPopup } = usePopup();

  const handlePlayerRowClick = (player: Player) => {
    console.log('Player clicked:', player);
    
    if (onPlayerClick) {
      onPlayerClick(player);
      return;
    }

    // Default popup behavior
    const rankInfo = getPlayerRank(player.global_points || 0);
    
    const tierAssignments = (player.tierAssignments || []).map(assignment => ({
      gamemode: assignment.gamemode,
      tier: assignment.tier,
      score: assignment.score || 0
    }));
    
    openPopup({
      player,
      tierAssignments,
      combatRank: {
        title: rankInfo.title,
        points: player.global_points || 0,
        color: rankInfo.color,
        effectType: 'general',
        rankNumber: player.overall_rank || 1,
        borderColor: rankInfo.borderColor || 'border-gray-400'
      },
      timestamp: new Date().toISOString()
    });
  };

  if (isMobile) {
    return (
      <div className="w-full space-y-2">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          const regionStyle = getRegionStyling(player.region);
          const rankBadge = getRankBadgeStyle(index + 1);
          
          return (
            <div
              key={player.id}
              className="relative w-full bg-[#2a3441] rounded-lg p-3 cursor-pointer hover:bg-[#323b48] transition-all duration-200"
              onClick={() => handlePlayerRowClick(player)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`
                  w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold
                  ${rankBadge.bgColor} ${rankBadge.textColor}
                `}>
                  {rankBadge.icon || index + 1}
                </div>

                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                    alt={player.ign}
                    onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(player.device)}
                    <span className="font-bold text-white text-sm">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs group relative">
                    <img 
                      src={rankInfo.iconPath}
                      alt={`${rankInfo.title} icon`}
                      className={`w-3 h-3 ${rankInfo.effectClass}`}
                      title={getRankTooltip(playerPoints)}
                    />
                    <span className="text-gray-300">{rankInfo.title}</span>
                    <span className="text-gray-400">({playerPoints} pts)</span>
                  </div>
                </div>

                <div className={`
                  w-6 h-6 rounded text-xs font-bold border flex items-center justify-center
                  ${regionStyle.bgColor} ${regionStyle.textColor} ${regionStyle.borderColor}
                `}>
                  {player.region || 'NA'}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                {[
                  { mode: 'mace', gamemode: 'Mace' },
                  { mode: 'sword', gamemode: 'Sword' },
                  { mode: 'crystal', gamemode: 'Crystal' },
                  { mode: 'axe', gamemode: 'Axe' },
                  { mode: 'uhc', gamemode: 'UHC' },
                  { mode: 'smp', gamemode: 'SMP' },
                  { mode: 'nethpot', gamemode: 'NethPot' },
                  { mode: 'bedwars', gamemode: 'Bedwars' }
                ].map(({ mode, gamemode }) => {
                  const tier = getPlayerTierForGamemode(player, gamemode);
                  
                  return (
                    <div 
                      key={mode} 
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500 flex items-center justify-center">
                        <GameModeIcon mode={mode} className="w-4 h-4 text-white" />
                      </div>
                      <div className={`px-1.5 py-0.5 rounded-full text-xs font-bold border min-w-[28px] text-center ${getTierBadgeColor(tier)}`}>
                        {tier === 'Not Ranked' ? 'NR' : tier}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1e252e] rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-bold text-gray-400 border-b border-gray-700 bg-[#252d37]">
        <div className="col-span-1">RANK</div>
        <div className="col-span-4">PLAYER</div>
        <div className="col-span-2 text-center">REGION</div>
        <div className="col-span-5 text-center">TIERS</div>
      </div>

      <div className="divide-y divide-gray-700">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          const regionStyle = getRegionStyling(player.region);
          const rankBadge = getRankBadgeStyle(index + 1);
          
          return (
            <div
              key={player.id}
              className="grid grid-cols-12 gap-4 px-6 py-3 cursor-pointer hover:bg-[#2a3441] transition-all duration-200"
              onClick={() => handlePlayerRowClick(player)}
            >
              <div className="col-span-1 flex items-center">
                <div className={`
                  w-8 h-8 flex items-center justify-center rounded-lg text-base font-bold
                  ${rankBadge.bgColor} ${rankBadge.textColor}
                `}>
                  {rankBadge.icon || index + 1}
                </div>
              </div>

              <div className="col-span-4 flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                    alt={player.ign}
                    onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    {getDeviceIcon(player.device)}
                    <span className="text-white font-bold text-base">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 group relative">
                    <img 
                      src={rankInfo.iconPath}
                      alt={`${rankInfo.title} icon`}
                      className={`w-4 h-4 ${rankInfo.effectClass}`}
                      title={getRankTooltip(playerPoints)}
                    />
                    <span className="text-gray-300 text-sm font-medium">
                      {rankInfo.title}
                    </span>
                    <span className="text-gray-400 text-sm">({playerPoints} points)</span>
                    
                    <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {getRankTooltip(playerPoints)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-center">
                <div className={`
                  w-8 h-8 rounded text-sm font-bold border-2 flex items-center justify-center shadow-lg
                  ${regionStyle.bgColor} ${regionStyle.textColor} ${regionStyle.borderColor}
                `}>
                  {player.region || 'NA'}
                </div>
              </div>

              <div className="col-span-5 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  {[
                    { mode: 'mace', gamemode: 'Mace' },
                    { mode: 'sword', gamemode: 'Sword' },
                    { mode: 'crystal', gamemode: 'Crystal' },
                    { mode: 'axe', gamemode: 'Axe' },
                    { mode: 'uhc', gamemode: 'UHC' },
                    { mode: 'smp', gamemode: 'SMP' },
                    { mode: 'nethpot', gamemode: 'NethPot' },
                    { mode: 'bedwars', gamemode: 'Bedwars' }
                  ].map(({ mode, gamemode }) => {
                    const tier = getPlayerTierForGamemode(player, gamemode);
                    
                    return (
                      <div 
                        key={mode} 
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500 flex items-center justify-center">
                          <GameModeIcon mode={mode} className="w-5 h-5 text-white" />
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-bold border min-w-[32px] text-center ${getTierBadgeColor(tier)}`}>
                          {tier === 'Not Ranked' ? 'NR' : tier}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
