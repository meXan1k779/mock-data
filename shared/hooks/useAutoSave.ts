import { useCallback, useEffect, useRef } from 'react';

import { debounce } from '../utils/debounce';

export const useAutoSave = (saveCallback: () => Promise<void>, delay = 1000) => {
  const saveCallbackRef = useRef(saveCallback);

  useEffect(() => {
    saveCallbackRef.current = saveCallback;
  }, [saveCallback]);

  // React Compiler flags reading `saveCallbackRef.current` inside the debounced
  // callback as a possible render-time ref read, since it can't prove `debounce()`
  // won't invoke it synchronously. It only ever runs later, from `triggerSave`
  // (an event handler) or the debounce timer, so this is safe.
  /* eslint-disable react-hooks/refs */
  const debouncedSave = useRef(
    debounce(async () => {
      await saveCallbackRef.current();
    }, delay),
  ).current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const triggerSave = useCallback(() => {
    debouncedSave();
  }, [debouncedSave]);

  return { triggerSave };
};
