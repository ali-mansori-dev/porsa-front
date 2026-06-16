import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, id, className = '', ...rest }: TextareaProps) {
  const textareaId = id ?? label?.replace(/\s+/g, '-').toLowerCase();
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5 w-full text-right">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        className={[
          'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900',
          'placeholder:text-slate-400 shadow-sm outline-none transition-all resize-none',
          'focus:ring-2 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
          hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />

      {(hint || error) && (
        <p className={`text-xs ${hasError ? 'text-red-600' : 'text-slate-500'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
