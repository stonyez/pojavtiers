
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePopup } from '@/contexts/PopupContext';
import { shouldDisableEffects, getOptimizedAnimationProps } from '@/utils/mobilePerformanceOptimizer';

export function CustomPlayerPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  const [isOptimizedMode] = React.useState(() => shouldDisableEffects());
  
  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 390;
  const position = popupData.player.overall_rank || 1;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  const MotionWrapper = isOptimizedMode ? 'div' : motion.div;
  const AnimationWrapper = isOptimizedMode ? React.Fragment : AnimatePresence;

  const overlayMotionProps = getOptimizedAnimationProps({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }, {});

  const containerMotionProps = getOptimizedAnimationProps({
    initial: { scale: 0.8, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0, y: 20 },
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }, {});

  return (
    <AnimationWrapper>
      {showPopup && (
        <MotionWrapper
          className={`fixed inset-0 ${isOptimizedMode ? 'bg-black/80' : 'bg-black/80 backdrop-blur-sm'} z-50 flex items-center justify-center p-4`}
          style={isOptimizedMode ? {
            transform: 'translateZ(0)',
            willChange: 'opacity',
            backfaceVisibility: 'hidden'
          } : {}}
          {...overlayMotionProps}
          onClick={handleOverlayClick}
        >
          <MotionWrapper
            className="relative w-[400px] rounded-xl overflow-hidden shadow-2xl"
            style={{
              background: '#2C3E50',
              minHeight: '500px',
              ...(isOptimizedMode ? {
                transform: 'translateZ(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              } : {})
            }}
            {...containerMotionProps}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors z-10 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Avatar Section */}
              <div className="mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div 
                    className="w-full h-full rounded-full border-4 overflow-hidden"
                    style={{ borderColor: '#F39C12' }}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage 
                        src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                        alt={popupData.player.ign}
                        className="object-cover object-center scale-110"
                        style={isOptimizedMode ? {
                          transform: 'translateZ(0) scale(1.1)',
                          backfaceVisibility: 'hidden'
                        } : {}}
                      />
                      <AvatarFallback className="bg-slate-700 text-white font-bold text-xl">
                        {popupData.player.ign.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Player Name */}
                <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {popupData.player.ign}
                </h3>

                {/* Combat Master Badge - simplified gradient on mobile */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-bold"
                  style={{ 
                    background: isOptimizedMode 
                      ? '#8B4513'
                      : 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
                    color: '#FFD700',
                    border: '1px solid #D2691E'
                  }}
                >
                  <span className="text-base">⚔</span>
                  <span>Combat Master</span>
                </div>

                {/* Region */}
                <div className="text-gray-400 text-sm mb-4" style={{ color: '#7F8C8D' }}>
                  North America
                </div>

                {/* NameMC Link */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: '#3498DB' }}
                  >
                    n
                  </div>
                  <span className="text-gray-400 text-sm cursor-pointer hover:text-blue-400 transition-colors">
                    NameMC ↗
                  </span>
                </div>
              </div>

              {/* Position Section */}
              <div className="mb-8">
                <h4 className="text-white text-sm font-medium mb-4 text-left uppercase tracking-wider" style={{ color: '#95A5A6' }}>
                  POSITION
                </h4>
                <div 
                  className="rounded-lg p-4 flex items-center"
                  style={{ background: '#34495E' }}
                >
                  <div 
                    className="w-12 h-8 rounded-l flex items-center justify-center text-white font-bold text-lg mr-4"
                    style={{ background: '#F39C12' }}
                  >
                    {position}.
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Trophy className="w-5 h-5" style={{ color: '#F39C12' }} />
                    <span className="text-white font-bold text-base">OVERALL</span>
                  </div>
                  <span className="text-gray-300 text-sm">
                    ({playerPoints} points)
                  </span>
                </div>
              </div>

              {/* Tiers Section - simplified styling on mobile */}
              <div>
                <h4 className="text-white text-sm font-medium mb-4 text-left uppercase tracking-wider" style={{ color: '#95A5A6' }}>
                  TIERS
                </h4>
                <div 
                  className="rounded-lg p-4"
                  style={{ background: '#34495E' }}
                >
                  <div className="flex justify-center gap-3 flex-wrap">
                    {/* Tier badges with optimized rendering */}
                    {[
                      { color: '#9B59B6', symbol: '◆', tier: 'HT1' },
                      { color: '#27AE60', symbol: '✓', tier: 'HT1' },
                      { color: '#8B4513', symbol: '⚔', tier: 'HT1' },
                      { color: '#3498DB', symbol: '🧪', tier: 'LT1' },
                      { color: '#7F8C8D', symbol: '🔥', tier: 'LT1' },
                      { color: '#2C3E50', symbol: '★', tier: 'LT1' },
                      { color: '#8E44AD', symbol: '👁', tier: 'HT2' },
                      { color: '#E91E63', symbol: '♥', tier: 'LT1' }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold text-white mb-1" 
                          style={{ 
                            borderColor: item.color, 
                            backgroundColor: item.color,
                            ...(isOptimizedMode ? {
                              transform: 'translateZ(0)',
                              backfaceVisibility: 'hidden'
                            } : {})
                          }}
                        >
                          {item.symbol}
                        </div>
                        <span className="text-xs font-bold" style={{ color: '#F39C12' }}>
                          {item.tier}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </MotionWrapper>
      )}
    </AnimationWrapper>
  );
}
