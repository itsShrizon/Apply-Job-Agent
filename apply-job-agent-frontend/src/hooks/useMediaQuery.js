import { useState, useEffect } from 'react';

/**
 * Custom hook for handling responsive design media queries
 * @param {string} query - CSS media query string (e.g. '(max-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Handle change event
    const handleMediaQueryChange = (event) => {
      setMatches(event.matches);
    };

    // Add event listener and remove on cleanup
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [query]);

  return matches;
}
