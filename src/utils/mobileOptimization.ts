
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobileUA || (isTouchDevice && isSmallScreen);
};

export const shouldDisableEffects = (): boolean => {
  return isMobileDevice();
};

export const getOptimizedClassName = (desktopClass: string, mobileClass: string = ''): string => {
  return shouldDisableEffects() ? mobileClass : desktopClass;
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      rootMargin: '50px',
      threshold: 0.1
    }
  );
};
