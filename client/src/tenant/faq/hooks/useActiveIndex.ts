import { useState, useCallback } from 'react';

export function useActiveIndex(initial: number | null = null) {
  const [activeIndex, setActiveIndex] = useState<number | null>(initial);
  const toggle = useCallback((i: number) => {
    setActiveIndex(curr => (curr === i ? null : i));
  }, []);
  return { activeIndex, toggle };
}
