import { useState } from 'react';
import { CATEGORIES } from '../lib/gameConstants';

interface SpinWheelProps {
  onSpinComplete: (category: string) => void;
  disabled?: boolean;
}

export default function SpinWheel({ onSpinComplete, disabled }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (spinning || disabled) return;

    setSpinning(true);

    const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
    const baseRotation = 360 * 5;
    const segmentAngle = 360 / CATEGORIES.length;
    const targetRotation = baseRotation + (randomIndex * segmentAngle);

    setRotation(targetRotation);

    setTimeout(() => {
      const category = CATEGORIES[randomIndex].name.toLowerCase();
      setSpinning(false);
      onSpinComplete(category);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-80 h-80">
        <div
          className="absolute inset-0 rounded-full transition-transform duration-3000 ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {CATEGORIES.map((category, index) => {
              const angle = (360 / CATEGORIES.length) * index;
              const nextAngle = (360 / CATEGORIES.length) * (index + 1);

              const startRad = (angle * Math.PI) / 180;
              const endRad = (nextAngle * Math.PI) / 180;

              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);

              const midAngle = (startRad + endRad) / 2;
              const textX = 50 + 35 * Math.cos(midAngle);
              const textY = 50 + 35 * Math.sin(midAngle);

              return (
                <g key={category.name}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={category.color}
                    stroke="#1f2937"
                    strokeWidth="0.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="6"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${angle + 45} ${textX} ${textY})`}
                  >
                    {category.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-white z-10" />
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || disabled}
        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {spinning ? 'Spinning...' : 'SPIN'}
      </button>
    </div>
  );
}
