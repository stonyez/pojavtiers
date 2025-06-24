
// Utility functions for Minecraft skin handling
export interface MojangProfile {
  id: string;
  name: string;
}

export const fetchUuidFromIgn = async (ign: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
    if (!response.ok) {
      console.warn(`Failed to fetch UUID for IGN: ${ign}`);
      return null;
    }
    
    const data: MojangProfile = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error fetching UUID from Mojang API:', error);
    return null;
  }
};

export const getSkinUrl = async (ign: string, uuid?: string): Promise<string> => {
  // If we already have UUID, use it directly
  if (uuid) {
    return `https://visage.surgeplay.com/bust/512/${uuid}`;
  }
  
  // Try to fetch UUID from IGN
  const fetchedUuid = await fetchUuidFromIgn(ign);
  if (fetchedUuid) {
    return `https://visage.surgeplay.com/bust/512/${fetchedUuid}`;
  }
  
  // Fallback to IGN-based URL
  return `https://visage.surgeplay.com/bust/512/${ign}`;
};

export const getAvatarUrl = (ign: string, javaUsername?: string): string => {
  const username = javaUsername || ign;
  return `https://visage.surgeplay.com/bust/128/${username}`;
};

export const handleAvatarError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  ign: string,
  javaUsername?: string
) => {
  const img = event.currentTarget;
  
  // Try alternative sources
  if (img.src.includes('visage.surgeplay.com')) {
    img.src = `https://crafatar.com/avatars/${javaUsername || ign}?size=128&overlay=true`;
  } else if (img.src.includes('crafatar.com')) {
    img.src = `https://mc-heads.net/avatar/${javaUsername || ign}/128`;
  } else {
    // Last fallback - use first letter
    img.style.display = 'none';
  }
};
