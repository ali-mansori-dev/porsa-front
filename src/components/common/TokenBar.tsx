import React from 'react';

interface TokenBarProps {
  current: number;
  limit: number;
  className?: string;
}

export default function TokenBar({ current, limit, className = 'h-[3px]' }: TokenBarProps) {
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;

  // Color logic
  let barColor = 'bg-green-600';
  if (percentage >= 90) {
    barColor = 'bg-rose-600';
  } else if (percentage >= 70) {
    barColor = 'bg-amber-500';
  }

  return (
    <div className={`w-full bg-slate-100 overflow-hidden relative ${className}`}>
      <div
        className={`h-full ${barColor} transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
