import React from 'react';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

/**
 * FormTextarea 컴포넌트
 * 
 * shadcn/ui Textarea와 Label을 조합한 폼 텍스트 영역 컴포넌트입니다.
 */
interface FormTextareaProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  rows = 4,
}) => {
  const errorId = error ? `${name}-error` : undefined;
  const helpId = helpText && !error ? `${name}-help` : undefined;
  const ariaDescribedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={name} className="mb-1.5 block">
          {label}
          {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
        </Label>
      )}

      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={cn(
          error && 'border-[var(--color-danger)]'
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
      />

      {error && (
        <p
          id={errorId}
          className="text-[var(--font-size-sm)] text-[var(--color-danger)] font-[var(--font-family-primary)] mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
      {helpText && !error && (
        <p
          id={helpId}
          className="text-[var(--font-size-sm)] text-[var(--color-text-tertiary)] font-[var(--font-family-primary)] mt-1"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};
