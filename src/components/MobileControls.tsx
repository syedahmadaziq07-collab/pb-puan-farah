import React, { useRef, useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface MobileControlsProps {
  onMoveVector: (vector: { x: number; y: number }) => void;
  onAction: () => void;
  hasActiveSpot: boolean;
  actionLabel?: string;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveVector,
  onAction,
  hasActiveSpot,
  actionLabel = 'PERIKSA (E)'
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);
    updateKnob(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        onMoveVector({ x: 0, y: 0 });
        break;
      }
    }
  };

  const updateKnob = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= maxRadius) {
      setKnobPos({ x: dx, y: dy });
      onMoveVector({ x: dx / maxRadius, y: -dy / maxRadius });
    } else {
      const angle = Math.atan2(dy, dx);
      const clampedX = Math.cos(angle) * maxRadius;
      const clampedY = Math.sin(angle) * maxRadius;
      setKnobPos({ x: clampedX, y: clampedY });
      onMoveVector({ x: clampedX / maxRadius, y: -clampedY / maxRadius });
    }
  };

  useEffect(() => {
    return () => {
      onMoveVector({ x: 0, y: 0 });
    };
  }, [onMoveVector]);

  return (
    <div className="md:hidden pointer-events-none fixed inset-0 z-30 select-none">
      {/* Virtual Joystick (Bottom Left) */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="pointer-events-auto absolute bottom-8 left-6 w-28 h-28 rounded-full bg-slate-900/60 backdrop-blur-sm border-2 border-slate-400/40 flex items-center justify-center touch-none shadow-xl active:border-amber-400"
      >
        <div
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
          }}
          className={`w-12 h-12 rounded-full transition-transform duration-75 flex items-center justify-center ${
            isDragging ? 'bg-amber-400 shadow-lg scale-110' : 'bg-slate-200/80 shadow-md'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-slate-700/60" />
        </div>
      </div>

      {/* Large Action Button (Bottom Right) */}
      <button
        onClick={onAction}
        className={`pointer-events-auto absolute bottom-8 right-6 w-24 h-24 rounded-full font-bold flex flex-col items-center justify-center gap-1 shadow-2xl transition-all active:scale-95 border-2 ${
          hasActiveSpot
            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-white scale-105 animate-pulse'
            : 'bg-slate-800/80 hover:bg-slate-700/80 text-white border-slate-600'
        }`}
      >
        <Search className="w-7 h-7" />
        <span className="text-xs uppercase tracking-wider text-center px-1 font-black">
          {actionLabel}
        </span>
      </button>
    </div>
  );
};
