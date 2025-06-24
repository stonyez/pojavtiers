
import React from 'react';
import { motion } from 'framer-motion';

interface RegionEffectsProps {
  region: string;
  className?: string;
  children: React.ReactNode;
}

// Check if desktop (≥768px width)
const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768;

// Get region configuration
const getRegionConfig = (region: string) => {
  const normalizedRegion = region?.toLowerCase() || 'unknown';
  
  switch (normalizedRegion) {
    case 'north america':
    case 'na':
      return {
        flag: '🇺🇸',
        glowColor: '#3b82f6',
        borderColor: 'border-blue-500/30',
        bgPattern: 'bg-gradient-to-r from-blue-500/10 to-red-500/10'
      };
    case 'europe':
    case 'eu':
      return {
        flag: '🇪🇺',
        glowColor: '#10b981',
        borderColor: 'border-green-500/30',
        bgPattern: 'bg-gradient-to-r from-green-500/10 to-blue-500/10'
      };
    case 'asia':
    case 'as':
      return {
        flag: '🌏',
        glowColor: '#f59e0b',
        borderColor: 'border-yellow-500/30',
        bgPattern: 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10'
      };
    case 'oceania':
    case 'oc':
      return {
        flag: '🇦🇺',
        glowColor: '#8b5cf6',
        borderColor: 'border-purple-500/30',
        bgPattern: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10'
      };
    case 'south america':
    case 'sa':
      return {
        flag: '🌎',
        glowColor: '#ef4444',
        borderColor: 'border-red-500/30',
        bgPattern: 'bg-gradient-to-r from-red-500/10 to-yellow-500/10'
      };
    case 'africa':
    case 'af':
      return {
        flag: '🌍',
        glowColor: '#f97316',
        borderColor: 'border-orange-500/30',
        bgPattern: 'bg-gradient-to-r from-orange-500/10 to-red-500/10'
      };
    default:
      return {
        flag: '🌍',
        glowColor: '#6b7280',
        borderColor: 'border-gray-500/30',
        bgPattern: 'bg-gradient-to-r from-gray-500/10 to-slate-500/10'
      };
  }
};

export function RegionEffects({ region, className = '', children }: RegionEffectsProps) {
  const desktop = isDesktop();
  const regionConfig = getRegionConfig(region);

  // On mobile, return children without effects
  if (!desktop) {
    return <>{children}</>;
  }

  return (
    <motion.div
      className={`relative ${regionConfig.bgPattern} ${regionConfig.borderColor} border rounded-lg ${className}`}
      initial={{ opacity: 0.8 }}
      whileHover={{ 
        opacity: 1,
        boxShadow: `0 0 20px ${regionConfig.glowColor}40`
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Region flag indicator */}
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
        <span className="text-xs">{regionConfig.flag}</span>
      </div>
      
      {/* Subtle glow overlay */}
      <div 
        className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${regionConfig.glowColor}20 0%, transparent 60%)`
        }}
      />
      
      {children}
    </motion.div>
  );
}

// Region badge component
export function RegionBadge({ region, size = 'sm' }: { region: string, size?: 'sm' | 'md' | 'lg' }) {
  const desktop = isDesktop();
  const regionConfig = getRegionConfig(region);

  // On mobile, show simple text
  if (!desktop) {
    return (
      <span className="text-xs text-gray-400">
        {region || 'Unknown'}
      </span>
    );
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-1 rounded-full ${regionConfig.bgPattern} ${regionConfig.borderColor} border backdrop-blur-sm ${sizeClasses[size]}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 0 15px ${regionConfig.glowColor}30`
      }}
    >
      <span>{regionConfig.flag}</span>
      <span className="text-white/90 font-medium">{region || 'Unknown'}</span>
    </motion.div>
  );
}
