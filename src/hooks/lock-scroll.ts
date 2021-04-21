import { useLayoutEffect } from 'react';

function useLockScroll() {
  useLayoutEffect(() => {
    // get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    // re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}

export default useLockScroll;
