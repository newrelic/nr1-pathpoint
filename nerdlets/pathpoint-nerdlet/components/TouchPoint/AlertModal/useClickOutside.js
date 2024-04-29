// Hooks
import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 * @param {Function} callback Callback
 * @return {RefObject} HTML Tag ref
 */
export default function useClickOutside(callback) {
  const ref = useRef(null);

  // Callback that executes when is outside of the ref
  const handleClickOutside = useCallback(e => {
    if (ref !== null && !ref.current.contains(e.target)) {
      if (typeof callback === 'function') callback(); // Execute callback
    }
  }, []);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return ref;
}
