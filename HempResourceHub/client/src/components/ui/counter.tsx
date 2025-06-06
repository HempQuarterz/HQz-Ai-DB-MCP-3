import { useState, useEffect, useRef } from "react";

interface CounterProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const Counter = ({
  end,
  start = 0,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CounterProps) => {
  const [count, setCount] = useState(start);
  const countRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const totalFrames = Math.round(duration / (1000 / 60)); // 60fps
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = start + (end - start) * easeOutQuad(progress);

      setCount(currentCount);

      if (frame < totalFrames) {
        countRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    // Easing function for smoother animation
    const easeOutQuad = (t: number) => t * (2 - t);

    countRef.current = requestAnimationFrame(animate);

    return () => {
      if (countRef.current !== null) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [start, end, duration]);

  // Format the number with commas and specified decimal places
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <span className="counting-number" data-oid="mjwihvc">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

export default Counter;
