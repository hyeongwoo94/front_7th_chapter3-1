import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

/**
 * FormSelect 컴포넌트
 * 
 * shadcn/ui Select를 사용한 폼 셀렉트 컴포넌트입니다.
 */
interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option...',
  required = false,
  disabled = false,
  error,
  helpText,
  size = 'md',
}) => {
  void size; // 향후 size 기능 추가 시 사용

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

      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          name={name}
          className={cn(
            error && 'border-[var(--color-danger)]',
            'w-full'
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
      >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
        {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
            {option.label}
            </SelectItem>
        ))}
        </SelectContent>
      </Select>

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
