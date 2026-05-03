
import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(target: number, duration = 800): number {
  const [current, setCurrent] = useState(target);
  const prevTarget = useRef(target);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevTarget.current === target) return;

    const start = prevTarget.current;
    const diff = target - start;
    const startTime = performance.now();

    if (animRef.current !== null) cancelAnimationFrame(animRef.current);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(start + diff * eased));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        prevTarget.current = target;
      }
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [target, duration]);

  return current;
}
