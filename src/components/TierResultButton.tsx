
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TierResultButtonProps {
  tier: number;
  title: string;
  subtitle: string;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

const TierResultButton: React.FC<TierResultButtonProps> = ({
  tier,
  title,
  subtitle,
  onClick,
  className,
  children
}) => {
  const getTierStyles = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-500/30 text-yellow-100 hover:from-yellow-400/30 hover:to-yellow-600/30";
      case 2:
        return "bg-gradient-to-br from-orange-400/20 to-orange-600/20 border-orange-500/30 text-orange-100 hover:from-orange-400/30 hover:to-orange-600/30";
      case 3:
        return "bg-gradient-to-br from-purple-400/20 to-purple-600/20 border-purple-500/30 text-purple-100 hover:from-purple-400/30 hover:to-purple-600/30";
      case 4:
        return "bg-gradient-to-br from-blue-400/20 to-blue-600/20 border-blue-500/30 text-blue-100 hover:from-blue-400/30 hover:to-blue-600/30";
      case 5:
        return "bg-gradient-to-br from-green-400/20 to-green-600/20 border-green-500/30 text-green-100 hover:from-green-400/30 hover:to-green-600/30";
      default:
        return "bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-gray-500/30 text-gray-100 hover:from-gray-400/30 hover:to-gray-600/30";
    }
  };

  const getRankIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('grandmaster')) {
      return '/lovable-uploads/16c235b0-dab8-4ccf-b7ad-dabf1b5ab241.png';
    } else if (lowerTitle.includes('master')) {
      return '/lovable-uploads/e54e2f83-6c11-40fb-ac21-2b453f7fe61d.png';
    } else if (lowerTitle.includes('ace')) {
      return '/lovable-uploads/f7ed966f-acac-4679-8435-8b21be09a65a.png';
    } else if (lowerTitle.includes('specialist')) {
      return '/lovable-uploads/6c0e2a7f-8297-46e4-a38c-0292e9a4a30b.png';
    } else if (lowerTitle.includes('cadet')) {
      return '/lovable-uploads/178d2c02-146b-4806-b1f6-4925fd91f33d.png';
    } else if (lowerTitle.includes('novice')) {
      return '/lovable-uploads/649443a2-5bcd-4e75-9d82-b560d2c613c2.png';
    } else if (lowerTitle.includes('rookie')) {
      return '/lovable-uploads/faa479be-c717-4099-ac1a-5398eca9a38b.png';
    }
    
    return '/lovable-uploads/faa479be-c717-4099-ac1a-5398eca9a38b.png'; // Default to rookie
  };

  const iconSrc = getRankIcon(title);

  return (
    <Button
      onClick={onClick}
      className={cn(
        "tier-result-button h-auto py-3 px-4 text-left border transition-all duration-300 rounded-lg backdrop-blur-sm",
        getTierStyles(tier),
        className
      )}
      variant="ghost"
    >
      <div className="w-full flex items-center space-x-3">
        <div className="flex-shrink-0">
          <img 
            src={iconSrc}
            alt={`${title} icon`}
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-1 truncate">{title}</div>
          <div className="text-xs opacity-80 truncate">{subtitle}</div>
          {children}
        </div>
      </div>
    </Button>
  );
};

export default TierResultButton;
