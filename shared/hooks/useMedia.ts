import { useState, useEffect } from 'react';

interface MediaSizes {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isXlDesktop: boolean;
}

export function useMedia(): MediaSizes {
  const [media, setMedia] = useState<MediaSizes>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        isXlDesktop: false,
      };
    }

    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width <= 1024,
      isDesktop: width >= 1025 && width <= 1439,
      isXlDesktop: width >= 1440,
    };
  });

  useEffect(() => {
    const updateMedia = () => {
      const width = window.innerWidth;

      setMedia({
        isMobile: width < 768,
        isTablet: width >= 768 && width <= 1024,
        isDesktop: width >= 1025 && width <= 1439,
        isXlDesktop: width >= 1440,
      });
    };

    window.addEventListener('resize', updateMedia);

    return () => {
      window.removeEventListener('resize', updateMedia);
    };
  }, []);

  return media;
}
