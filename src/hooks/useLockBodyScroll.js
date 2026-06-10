import { useEffect } from 'react';

/**
 * Lock the document's vertical scroll while a modal / overlay is open.
 * Restores the previous `overflow` value on unmount.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [locked]);
}
