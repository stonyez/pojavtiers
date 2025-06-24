
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getPlayerRank } from '@/utils/rankUtils';
import { shouldDisableEffects, getOptimizedAnimationProps } from '@/utils/mobilePerformanceOptimizer';

interface RankBadgeEffectsProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Get rank configuration based on points
const getRankConfig = (points: number) => {
  const rank = getPlayerRank(points);
  
  if (points >= 400) {
    return {
      title: 'Combat Grandmaster',
      iconPath: '/lovable-uploads/16c235b0-dab8-4ccf-b7ad-dabf1b5ab241.png',
      gradient: 'from-purple-600 via-violet-500 to-fuchsia-600',
      shadowColor: 'rgba(147,51,234,0.8)',
      glowColor: '#a855f7',
      particleColors: ['#a855f7', '#c084fc', '#d8b4fe', '#8b5cf6'],
      borderGlow: 'shadow-[0_0_30px_rgba(147,51,234,0.8)]',
      textGlow: 'drop-shadow-[0_0_15px_rgba(147,51,234,1)]',
      effectType: 'legendary'
    };
  } else if (points >= 250) {
    return {
      title: 'Combat Master',
      iconPath: '/lovable-uploads/e54e2f83-6c11-40fb-ac21-2b453f7fe61d.png',
      gradient: 'from-yellow-600 via-amber-500 to-orange-600',
      shadowColor: 'rgba(251,191,36,0.8)',
      glowColor: '#fbbf24',
      particleColors: ['#fbbf24', '#f59e0b', '#f97316', '#ea580c'],
      borderGlow: 'shadow-[0_0_25px_rgba(251,191,36,0.8)]',
      textGlow: 'drop-shadow-[0_0_12px_rgba(251,191,36,1)]',
      effectType: 'royal'
    };
  } else if (points >= 100) {
    return {
      title: 'Combat Ace',
      iconPath: '/lovable-uploads/f7ed966f-acac-4679-8435-8b21be09a65a.png',
      gradient: 'from-blue-600 via-cyan-500 to-indigo-600',
      shadowColor: 'rgba(59,130,246,0.7)',
      glowColor: '#3b82f6',
      particleColors: ['#3b82f6', '#06b6d4', '#6366f1', '#8b5cf6'],
      borderGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.7)]',
      textGlow: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.9)]',
      effectType: 'stellar'
    };
  } else if (points >= 50) {
    return {
      title: 'Combat Specialist',
      iconPath: '/lovable-uploads/6c0e2a7f-8297-46e4-a38c-0292e9a4a30b.png',
      gradient: 'from-green-600 via-emerald-500 to-teal-600',
      shadowColor: 'rgba(34,197,94,0.6)',
      glowColor: '#22c55e',
      particleColors: ['#22c55e', '#10b981', '#14b8a6', '#06b6d4'],
      borderGlow: 'shadow-[0_0_18px_rgba(34,197,94,0.6)]',
      textGlow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]',
      effectType: 'guardian'
    };
  } else if (points >= 20) {
    return {
      title: 'Combat Cadet',
      iconPath: '/lovable-uploads/178d2c02-146b-4806-b1f6-4925fd91f33d.png',
      gradient: 'from-orange-600 via-amber-500 to-yellow-600',
      shadowColor: 'rgba(249,115,22,0.6)',
      glowColor: '#f97316',
      particleColors: ['#f97316', '#f59e0b', '#eab308', '#ca8a04'],
      borderGlow: 'shadow-[0_0_15px_rgba(249,115,22,0.6)]',
      textGlow: 'drop-shadow-[0_0_6px_rgba(249,115,22,0.7)]',
      effectType: 'warrior'
    };
  } else if (points >= 10) {
    return {
      title: 'Combat Novice',
      iconPath: '/lovable-uploads/649443a2-5bcd-4e75-9d82-b560d2c613c2.png',
      gradient: 'from-slate-600 via-gray-500 to-slate-700',
      shadowColor: 'rgba(100,116,139,0.5)',
      glowColor: '#64748b',
      particleColors: ['#64748b', '#6b7280', '#9ca3af', '#d1d5db'],
      borderGlow: 'shadow-[0_0_12px_rgba(100,116,139,0.5)]',
      textGlow: 'drop-shadow-[0_0_4px_rgba(100,116,139,0.6)]',
      effectType: 'apprentice'
    };
  } else {
    return {
      title: 'Rookie',
      iconPath: '/lovable-uploads/faa479be-c717-4099-ac1a-5398eca9a38b.png',
      gradient: 'from-gray-600 via-slate-500 to-gray-700',
      shadowColor: 'rgba(107,114,128,0.4)',
      glowColor: '#6b7280',
      particleColors: ['#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'],
      borderGlow: 'shadow-[0_0_10px_rgba(107,114,128,0.4)]',
      textGlow: 'drop-shadow-[0_0_3px_rgba(107,114,128,0.5)]',
      effectType: 'novice'
    };
  }
};

export function RankBadgeEffects({ points, size = 'md', animated = true, className = '', children }: RankBadgeEffectsProps) {
  const rankConfig = getRankConfig(points);
  const disableEffects = shouldDisableEffects();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const MotionWrapper = (!disableEffects && animated) ? motion.div : 'div';
  
  const motionProps = getOptimizedAnimationProps({
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.1 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }, {});

  return (
    <MotionWrapper
      className={`relative inline-flex items-center justify-center rounded-full border-2 border-white/20 overflow-hidden ${sizeClasses[size]} ${className}`}
      style={{
        background: disableEffects 
          ? '#3b82f6' // Simple blue background for mobile
          : `linear-gradient(135deg, ${rankConfig.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`
      }}
      {...motionProps}
    >
      {/* Glow effect background - desktop only */}
      {!disableEffects && (
        <div 
          className={`absolute inset-0 rounded-full ${rankConfig.borderGlow} opacity-60`}
          style={{
            background: `radial-gradient(circle, ${rankConfig.glowColor}40 0%, transparent 70%)`
          }}
        />
      )}

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center text-white">
        {children || (
          <img 
            src={rankConfig.iconPath}
            alt={`${rankConfig.title} icon`}
            className={`${iconSizeClasses[size]} object-contain`}
            loading="lazy"
            style={disableEffects ? { 
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            } : {}}
          />
        )}
      </div>

      {/* Inner glow - desktop only */}
      {!disableEffects && (
        <div 
          className="absolute inset-1 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${rankConfig.glowColor}60 0%, transparent 50%)`
          }}
        />
      )}

      {/* Shine effect - desktop only */}
      {!disableEffects && animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${rankConfig.glowColor}40 50%, transparent 70%)`
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}
    </MotionWrapper>
  );
}

// Enhanced rank text with effects - desktop only
export function RankText({ points, className = '' }: { points: number, className?: string }) {
  const rankConfig = getRankConfig(points);
  const disableEffects = shouldDisableEffects();

  const MotionWrapper = !disableEffects ? motion.span : 'span';
  const motionProps = getOptimizedAnimationProps({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 }
  }, {});

  return (
    <MotionWrapper
      className={`font-bold ${!disableEffects ? rankConfig.textGlow : ''} ${className}`}
      style={disableEffects ? {
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      } : {}}
      {...motionProps}
    >
      {rankConfig.title}
    </MotionWrapper>
  );
}

// Position badge with enhanced effects - desktop only
export function PositionBadge({ position, points, className = '' }: { position: number, points: number, className?: string }) {
  const rankConfig = getRankConfig(points);
  const disableEffects = shouldDisableEffects();

  const MotionWrapper = !disableEffects ? motion.div : 'div';
  const motionProps = getOptimizedAnimationProps({
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.05, rotate: 2 },
    transition: { type: "spring", stiffness: 300, damping: 15 }
  }, {});

  return (
    <MotionWrapper
      className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-white/20 ${!disableEffects ? rankConfig.borderGlow : ''} ${className}`}
      style={{
        background: disableEffects 
          ? '#3b82f6' // Simple blue background for mobile
          : `linear-gradient(135deg, ${rankConfig.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`
      }}
      {...motionProps}
    >
      <span className={`text-2xl font-black text-white ${!disableEffects ? rankConfig.textGlow : ''}`}>
        {position}
      </span>
      
      {/* Corner decoration - desktop only */}
      {!disableEffects && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
          <img 
            src={rankConfig.iconPath}
            alt="rank icon"
            className="w-3 h-3 object-contain"
            loading="lazy"
          />
        </div>
      )}
    </MotionWrapper>
  );
}
