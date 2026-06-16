import React from 'react';

interface TokenProgressRingProps {
  current: number;
  limit: number;
  size?: number;
  strokeWidth?: number;
}

export default function TokenProgressRing({
  current,
  limit,
  size = 180,
  strokeWidth = 14
}: TokenProgressRingProps) {
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  
  // SVG geometry calculations
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color matching rules (Green -> Yellow 70% -> Red 90%)
  let strokeColor = '#16a34a'; // Green
  let textClass = 'text-green-600';
  let bgFillColor = 'bg-green-50 text-green-700 border-green-100';

  if (percentage >= 90) {
    strokeColor = '#dc2626'; // Red
    textClass = 'text-rose-600 animate-pulse';
    bgFillColor = 'bg-rose-50 text-rose-700 border-rose-100';
  } else if (percentage >= 70) {
    strokeColor = '#d97706'; // Orange/Yellow
    textClass = 'text-amber-600';
    bgFillColor = 'bg-amber-50 text-amber-700 border-amber-100';
  }

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Progress Arc */}
        <svg className="-rotate-90 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Used</span>
          <span className="text-2xl font-bold font-mono text-slate-800 leading-none my-1">
            {current.toLocaleString()}
          </span>
          <div className="w-10 h-[1px] bg-slate-200 my-1" />
          <span className="text-xs text-slate-500 font-medium">
            of {limit.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quick status badge below */}
      <span className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold border ${bgFillColor}`}>
        {percentage.toFixed(1)}% Allotted Limit Used
      </span>
    </div>
  );
}
