import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  leftIcon,
  rightIcon,
  id,
  className = '',
  ...rest
}: InputProps) {
  const inputId = id ?? label?.replace(/\s+/g, '-').toLowerCase();
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5 w-full text-right">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          className={[
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900',
            'placeholder:text-slate-400 shadow-sm outline-none transition-all',
            'focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200',
            leftIcon ? 'pr-10' : '',
            rightIcon ? 'pl-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {rightIcon && (
          <span className="absolute left-3.5 text-slate-400 flex items-center">
            {rightIcon}
          </span>
        )}
      </div>

      {(hint || error) && (
        <p className={`text-xs ${hasError ? 'text-red-600' : 'text-slate-500'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
