
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobileUA || (isTouchDevice && isSmallScreen);
};

export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  // Check user's motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Force reduced motion on mobile devices
  const isMobile = isMobileDevice();
  
  return prefersReducedMotion || isMobile;
};

export const shouldDisableEffects = (): boolean => {
  return isMobileDevice();
};

export const getOptimizedAnimationProps = (desktopProps: any, mobileProps: any = {}) => {
  return shouldReduceMotion() ? mobileProps : desktopProps;
};

// Performance-aware conditional rendering
export const ConditionalRender = ({ 
  children, 
  fallback = null, 
  condition = () => !shouldDisableEffects() 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  condition?: () => boolean;
}) => {
  return condition() ? children : fallback;
};

// Throttle function for performance
export const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  
  return function (...args: any[]) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Lazy loading intersection observer optimized for mobile
export const createMobileOptimizedObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  // Use more conservative settings on mobile
  const options = isMobileDevice() 
    ? { rootMargin: '10px', threshold: 0.05 }
    : { rootMargin: '50px', threshold: 0.1 };
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    options
  );
};

// GPU acceleration helper
export const enableGPUAcceleration = (element: HTMLElement) => {
  if (!shouldDisableEffects()) {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  }
};

// Cleanup GPU acceleration
export const cleanupGPUAcceleration = (element: HTMLElement) => {
  element.style.transform = '';
  element.style.willChange = '';
};
