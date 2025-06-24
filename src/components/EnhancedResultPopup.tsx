
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Monitor, Smartphone, Gamepad } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RankBadgeEffects, RankText, PositionBadge } from './RankBadgeEffects';
import { usePopup } from '@/contexts/PopupContext';
import { GameMode } from '@/services/playerService';
import { toDisplayGameMode } from '@/utils/gamemodeUtils';

// Helper to get device icon
const getDeviceIcon = (device: string = 'PC') => {
  switch(device?.toLowerCase()) {
    case 'mobile':
    case 'bedrock':
      return <Smartphone className="w-4 h-4 text-blue-400" />;
    case 'console':
      return <Gamepad className="w-4 h-4 text-green-400" />;
    case 'pc':
    case 'java':
    default:
      return <Monitor className="w-4 h-4 text-white/80" />;
  }
};

// Helper to get region styling with enhanced colors and hex values
const getRegionStyling = (regionCode: string = 'NA') => {
  const regions: Record<string, { 
    name: string, 
    borderColor: string, 
    gradientFrom: string, 
    gradientTo: string,
    glowColor: string,
    accentColor: string,
    hexColor: string
  }> = {
    'NA': { 
      name: 'North America', 
      borderColor: 'border-green-400',
      gradientFrom: 'from-green-500/30',
      gradientTo: 'to-emerald-500/20',
      glowColor: 'shadow-green-500/30',
      accentColor: 'text-green-400',
      hexColor: '#10b981'
    },
    'EU': { 
      name: 'Europe', 
      borderColor: 'border-purple-400',
      gradientFrom: 'from-purple-500/30',
      gradientTo: 'to-violet-500/20',
      glowColor: 'shadow-purple-500/30',
      accentColor: 'text-purple-400',
      hexColor: '#8b5cf6'
    },
    'ASIA': { 
      name: 'Asia', 
      borderColor: 'border-red-400',
      gradientFrom: 'from-red-500/30',
      gradientTo: 'to-rose-500/20',
      glowColor: 'shadow-red-500/30',
      accentColor: 'text-red-400',
      hexColor: '#ef4444'
    },
    'SA': { 
      name: 'South America', 
      borderColor: 'border-orange-400',
      gradientFrom: 'from-orange-500/30',
      gradientTo: 'to-amber-500/20',
      glowColor: 'shadow-orange-500/30',
      accentColor: 'text-orange-400',
      hexColor: '#f97316'
    },
    'AF': { 
      name: 'Africa', 
      borderColor: 'border-fuchsia-400',
      gradientFrom: 'from-fuchsia-500/30',
      gradientTo: 'to-pink-500/20',
      glowColor: 'shadow-fuchsia-500/30',
      accentColor: 'text-fuchsia-400',
      hexColor: '#ec4899'
    },
    'OCE': { 
      name: 'Oceania', 
      borderColor: 'border-teal-400',
      gradientFrom: 'from-teal-500/30',
      gradientTo: 'to-cyan-500/20',
      glowColor: 'shadow-teal-500/30',
      accentColor: 'text-teal-400',
      hexColor: '#06b6d4'
    }
  };
  
  return regions[regionCode] || regions['NA'];
};

// Format tier display to match reference image
const formatTierDisplay = (tier: string): { code: string, label: string, color: string } => {
  if (tier === 'Retired') return { code: 'RT', label: '', color: 'text-gray-500' };
  if (tier === 'Not Ranked') return { code: 'NR', label: '', color: 'text-gray-600' };
  
  let code = 'T?';
  let label = '';
  let color = 'text-white';
  
  if (tier.includes('T1')) {
    code = tier.includes('H') ? 'HT1' : 'LT1';
    color = tier.includes('H') ? 'text-yellow-300' : 'text-yellow-400';
  } else if (tier.includes('T2')) {
    code = tier.includes('H') ? 'HT2' : 'LT2';
    color = tier.includes('H') ? 'text-orange-300' : 'text-orange-400';
  } else if (tier.includes('T3')) {
    code = tier.includes('H') ? 'HT3' : 'LT3';
    color = tier.includes('H') ? 'text-blue-300' : 'text-blue-400';
  } else if (tier.includes('T4')) {
    code = tier.includes('H') ? 'HT4' : 'LT4';
    color = tier.includes('H') ? 'text-green-300' : 'text-green-400';
  } else if (tier.includes('T5')) {
    code = tier.includes('H') ? 'HT5' : 'LT5';
    color = tier.includes('H') ? 'text-purple-300' : 'text-purple-400';
  }
  
  return { code, label, color };
};

export function EnhancedResultPopup() {
  const { popupData, showPopup, isMobile, closePopup } = usePopup();
  
  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 0;
  const position = popupData.player.overall_rank || 1;
  const region = popupData.player.region || 'NA';
  const regionStyling = getRegionStyling(region);

  // Ordered gamemode layout matching reference
  const orderedGamemodes: GameMode[] = [
    'Crystal', 'Sword', 'Bedwars',
    'Mace', 'SMP', 'UHC',
    'NethPot', 'Axe'
  ];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  // Mobile optimization: remove heavy effects and animations
  const overlayStyle = isMobile
    ? "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    : "fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4";

  const containerStyle = isMobile
    ? "relative rounded-xl w-full max-w-sm border-2 shadow-lg overflow-hidden bg-slate-900"
    : `relative rounded-3xl w-full max-w-sm border-3 ${regionStyling.borderColor} shadow-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`;

  const gradientOverlay = isMobile ? null : (
    <div className={`absolute inset-0 bg-gradient-to-br ${regionStyling.gradientFrom} ${regionStyling.gradientTo} opacity-60`} />
  );

  const MotionWrapper = isMobile ? 'div' : motion.div;
  const AnimationWrapper = isMobile ? React.Fragment : AnimatePresence;

  const motionProps = isMobile ? {} : {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    onClick: handleOverlayClick
  };

  const containerMotionProps = isMobile ? {} : {
    style: {
      borderColor: regionStyling.hexColor,
      boxShadow: `0 0 40px ${regionStyling.hexColor}60, 0 8px 32px rgba(0, 0, 0, 0.4)`
    },
    initial: { scale: 0.7, opacity: 0, y: 100, rotateX: -20 },
    animate: { scale: 1, opacity: 1, y: 0, rotateX: 0 },
    exit: { scale: 0.7, opacity: 0, y: 100, rotateX: -20 },
    transition: { type: "spring", stiffness: 300, damping: 25 },
    onClick: (e: React.MouseEvent) => e.stopPropagation()
  };

  return (
    <AnimationWrapper>
      {showPopup && (
        <MotionWrapper
          className={overlayStyle}
          {...motionProps}
          onClick={handleOverlayClick}
        >
          <MotionWrapper
            className={containerStyle}
            {...containerMotionProps}
          >
            {gradientOverlay}

            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 rounded-xl transition-all z-30 backdrop-blur-md border border-white/20"
            >
              <X className="w-5 h-5 text-white/90" />
            </button>

            {/* Content */}
            <div className="relative z-20 p-6 text-center">
              {/* Avatar Section with Enhanced Rank Badge */}
              <div className="mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Avatar 
                    className="w-full h-full rounded-full border-4 overflow-hidden"
                    style={isMobile ? {} : {
                      borderColor: regionStyling.hexColor,
                      boxShadow: `0 0 20px ${regionStyling.hexColor}40`
                    }}
                  >
                    <AvatarImage 
                      src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                      alt={popupData.player.ign}
                      className="object-cover object-center scale-110"
                    />
                    <AvatarFallback className="bg-slate-700 text-white font-bold text-xl">
                      {popupData.player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Enhanced rank badge positioned at bottom right */}
                  <div className="absolute -bottom-2 -right-2">
                    <RankBadgeEffects 
                      points={playerPoints} 
                      size="lg" 
                      animated={!isMobile}
                    />
                  </div>
                </div>

                {/* Player Name with Device Icon */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  {getDeviceIcon(popupData.player.device)}
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    {popupData.player.ign}
                  </h3>
                </div>

                {/* Enhanced Rank Title */}
                <div 
                  className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-md mb-3 ${isMobile ? 'bg-slate-800' : `bg-gradient-to-r ${regionStyling.gradientFrom} ${regionStyling.gradientTo}`}`}
                  style={isMobile ? {} : {
                    borderColor: regionStyling.hexColor,
                    boxShadow: `0 0 15px ${regionStyling.hexColor}30`
                  }}
                >
                  <RankText points={playerPoints} className="text-white text-sm uppercase tracking-wider" />
                </div>

                {/* Region */}
                <div className={`${regionStyling.accentColor} text-sm font-medium`}>
                  🌍 {regionStyling.name}
                </div>
              </div>

              {/* Enhanced Position Section */}
              <div className="mb-6">
                <h4 className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-bold">
                  🏆 COMBAT POSITION
                </h4>
                
                <div className="flex items-center justify-center gap-4">
                  <PositionBadge position={position} points={playerPoints} />
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-bold">{playerPoints}</span>
                    </div>
                    <span className="text-slate-400 text-xs">Combat Points</span>
                  </div>
                </div>
              </div>

              {/* Tiers Section */}
              <div>
                <h4 className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-bold">
                  ⚔️ GAMEMODE TIERS
                </h4>
                
                <div className="grid grid-cols-4 gap-2">
                  {orderedGamemodes.map((mode, index) => {
                    const assignment = popupData.tierAssignments.find(a => a.gamemode === mode);
                    const tier = assignment?.tier || 'Not Ranked';
                    const { code, color } = formatTierDisplay(tier);
                    
                    const TierWrapper = isMobile ? 'div' : motion.div;
                    const tierMotionProps = isMobile ? {} : {
                      initial: { opacity: 0, scale: 0.8 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { delay: 0.8 + index * 0.05 },
                      whileHover: { scale: 1.05 }
                    };
                    
                    return (
                      <TierWrapper
                        key={mode}
                        className={`flex flex-col items-center p-2 bg-slate-700/40 rounded-lg border hover:border-slate-500/60 transition-all ${isMobile ? '' : 'backdrop-blur-sm'}`}
                        style={isMobile ? {} : {
                          borderColor: `${regionStyling.hexColor}60`,
                          boxShadow: `0 0 5px ${regionStyling.hexColor}20`
                        }}
                        {...tierMotionProps}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center cursor-help">
                                <div className="mb-1">
                                  <GameModeIcon mode={mode.toLowerCase()} className="w-4 h-4" />
                                </div>
                                <div className="text-center">
                                  <span className={`text-xs font-bold ${color}`}>{code}</span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-center">
                                <p className="font-medium">{toDisplayGameMode(mode)}</p>
                                {tier !== 'Not Ranked' ? (
                                  <p className="text-sm">{assignment?.score || 0} points</p>
                                ) : (
                                  <p className="text-sm">Not Ranked</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TierWrapper>
                    );
                  })}
                </div>
              </div>
            </div>
          </MotionWrapper>
        </MotionWrapper>
      )}
    </AnimationWrapper>
  );
}
