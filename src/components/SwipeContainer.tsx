import { ReactNode, useRef, useEffect } from 'react';

interface SwipeContainerProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  canSwipeLeft: boolean;
  canSwipeRight: boolean;
}

export function SwipeContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  canSwipeLeft,
  canSwipeRight,
}: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const dragOffset = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      dragOffset.current = deltaX;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;

    const threshold = 50;

    if (dragOffset.current > threshold && canSwipeRight) {
      onSwipeRight();
    } else if (dragOffset.current < -threshold && canSwipeLeft) {
      onSwipeLeft();
    }

    dragOffset.current = 0;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="overflow-hidden"
    >
      {children}
    </div>
  );
}
