import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  resetTimer: (seconds: number) => void;
  formatTime: () => string;
}

export const useTimerWithPersist = (storageKey: string = 'timer'): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimeout = useCallback(
    (seconds: number) => {
      if (seconds <= 0) {
        setIsActive(false);
        localStorage.removeItem(storageKey);
        return;
      }

      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }

      timeoutRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          if (newTime > 0) {
            const endTime = Math.floor(Date.now() / 1000) + newTime;
            localStorage.setItem(storageKey, JSON.stringify({ endTime }));
          } else {
            setIsActive(false);
            localStorage.removeItem(storageKey);
            if (timeoutRef.current) {
              clearInterval(timeoutRef.current);
            }
          }

          return newTime;
        });
      }, 1000);
    },
    [storageKey],
  );

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const { endTime } = JSON.parse(savedData);
        const now = Math.floor(Date.now() / 1000);
        const savedEndTime = parseInt(endTime, 10);

        if (savedEndTime > now) {
          const remaining = savedEndTime - now;
          // Hydrating from localStorage (unavailable during SSR/first render),
          // not derived from props/state — a legitimate one-time external sync.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setTimeLeft(remaining);
          setIsActive(true);
          startTimeout(remaining);
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch (error) {
        console.error('Error parsing timer data:', error);
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey, startTimeout]);

  const startTimer = useCallback(
    (seconds: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setTimeLeft(seconds);
      setIsActive(true);

      const endTime = Math.floor(Date.now() / 1000) + seconds;
      localStorage.setItem(storageKey, JSON.stringify({ endTime }));

      startTimeout(seconds);
    },
    [startTimeout, storageKey],
  );

  const stopTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsActive(false);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const resetTimer = useCallback(
    (seconds: number) => {
      stopTimer();
      setTimeLeft(seconds);
    },
    [stopTimer],
  );

  const formatTime = useCallback((): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    isActive,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  };
};
