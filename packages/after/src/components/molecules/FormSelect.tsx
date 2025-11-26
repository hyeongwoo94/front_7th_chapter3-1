import React from 'react';
import {
  NativeSelect,
  NativeSelectOption,
} from '../ui/native-select';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

/**
 * FormSelect 컴포넌트
 * 
 * shadcn/ui Native Select를 사용한 폼 셀렉트 컴포넌트입니다.
 * 테스트 호환성을 위해 실제 HTML select 요소를 사용합니다.
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

      <NativeSelect
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
          className={cn(
            error && 'border-[var(--color-danger)]',
            'w-full'
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
      >
        {placeholder && (
          <NativeSelectOption value="" disabled>
            {placeholder}
          </NativeSelectOption>
        )}
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      {error && (
        <p
          id={errorId}
          className="text-[var(--color-danger)] font-[var(--font-family-primary)] mt-1"
          style={{ fontSize: "var(--font-size-sm)" }}
          role="alert"
        >
          {error}
        </p>
      )}
      {helpText && !error && (
        <p
          id={helpId}
          className="text-[var(--color-text-tertiary)] font-[var(--font-family-primary)] mt-1"
          style={{ fontSize: "var(--font-size-sm)" }}
        >
          {helpText}
        </p>
      )}
    </div>
  );
};
