
// Utility functions for player ranks based on points

export interface RankTier {
  title: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  gradient: string;
  icon: string;
  iconPath: string;
  borderColor: string;
  effectClass: string;
}

// Updated rank tiers with effect classes for enhanced visual effects and new icon paths
export const rankTiers: RankTier[] = [
  {
    title: "Rookie",
    minPoints: 0,
    maxPoints: 9,
    color: "text-gray-400",
    gradient: "from-gray-500 to-gray-600",
    icon: "🥉",
    iconPath: "/lovable-uploads/faa479be-c717-4099-ac1a-5398eca9a38b.png",
    borderColor: "border-gray-400",
    effectClass: "rank-effect-rookie"
  },
  {
    title: "Combat Novice",
    minPoints: 10,
    maxPoints: 19,
    color: "text-slate-400",
    gradient: "from-slate-500 to-slate-600",
    icon: "🏅",
    iconPath: "/lovable-uploads/649443a2-5bcd-4e75-9d82-b560d2c613c2.png",
    borderColor: "border-slate-400",
    effectClass: "rank-effect-novice"
  },
  {
    title: "Combat Cadet",
    minPoints: 20,
    maxPoints: 49,
    color: "text-green-400",
    gradient: "from-green-500 to-green-600",
    icon: "⚔️",
    iconPath: "/lovable-uploads/178d2c02-146b-4806-b1f6-4925fd91f33d.png",
    borderColor: "border-green-400",
    effectClass: "rank-effect-cadet"
  },
  {
    title: "Combat Specialist",
    minPoints: 50,
    maxPoints: 99,
    color: "text-cyan-400",
    gradient: "from-cyan-500 to-cyan-600",
    icon: "🛡️",
    iconPath: "/lovable-uploads/6c0e2a7f-8297-46e4-a38c-0292e9a4a30b.png",
    borderColor: "border-cyan-400",
    effectClass: "rank-effect-specialist"
  },
  {
    title: "Combat Ace",
    minPoints: 100,
    maxPoints: 249,
    color: "text-orange-400",
    gradient: "from-orange-500 to-orange-600",
    icon: "⭐",
    iconPath: "/lovable-uploads/f7ed966f-acac-4679-8435-8b21be09a65a.png",
    borderColor: "border-orange-400",
    effectClass: "rank-effect-ace"
  },
  {
    title: "Combat Master",
    minPoints: 250,
    maxPoints: 399,
    color: "text-violet-400",
    gradient: "from-violet-500 to-violet-600",
    icon: "👑",
    iconPath: "/lovable-uploads/e54e2f83-6c11-40fb-ac21-2b453f7fe61d.png",
    borderColor: "border-violet-400",
    effectClass: "rank-effect-master"
  },
  {
    title: "Combat Grandmaster",
    minPoints: 400,
    maxPoints: null,
    color: "text-purple-400",
    gradient: "from-purple-500 to-purple-600",
    icon: "💎",
    iconPath: "/lovable-uploads/16c235b0-dab8-4ccf-b7ad-dabf1b5ab241.png",
    borderColor: "border-purple-400",
    effectClass: "rank-effect-grandmaster"
  }
];

/**
 * Get the rank tier based on points
 */
export function getPlayerRank(points: number): RankTier {
  const validPoints = typeof points === 'number' && !isNaN(points) ? Math.max(0, points) : 0;
  
  for (let i = rankTiers.length - 1; i >= 0; i--) {
    const tier = rankTiers[i];
    if (validPoints >= tier.minPoints && (tier.maxPoints === null || validPoints <= tier.maxPoints)) {
      return tier;
    }
  }
  
  return rankTiers[0];
}

/**
 * Format a range of points for display
 */
export function formatPointsRange(minPoints: number, maxPoints: number | null): string {
  if (maxPoints === null) {
    return `${minPoints}+`;
  }
  return `${minPoints} – ${maxPoints}`;
}

/**
 * Get the next rank tier a player is working towards
 */
export function getNextRank(points: number): RankTier | null {
  const validPoints = typeof points === 'number' && !isNaN(points) ? Math.max(0, points) : 0;
  
  const currentRankIndex = rankTiers.findIndex(tier => 
    validPoints >= tier.minPoints && 
    (tier.maxPoints === null || validPoints <= tier.maxPoints)
  );
  
  if (currentRankIndex === -1 || currentRankIndex === rankTiers.length - 1) {
    return null;
  }
  
  return rankTiers[currentRankIndex + 1];
}

/**
 * Calculate progress to next rank (0-100)
 */
export function getProgressToNextRank(points: number): number {
  const validPoints = typeof points === 'number' && !isNaN(points) ? Math.max(0, points) : 0;
  const currentRank = getPlayerRank(validPoints);
  const nextRank = getNextRank(validPoints);
  
  if (!nextRank) return 100;
  
  const progressPoints = validPoints - currentRank.minPoints;
  const totalPointsNeeded = nextRank.minPoints - currentRank.minPoints;
  
  return Math.round((progressPoints / totalPointsNeeded) * 100);
}
