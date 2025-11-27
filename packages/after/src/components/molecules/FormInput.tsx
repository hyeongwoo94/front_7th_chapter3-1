import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

/**
 * FormInput 컴포넌트
 * 
 * shadcn/ui Input과 Label을 조합한 폼 입력 컴포넌트입니다.
 * 순수 UI 컴포넌트로, 검증 로직은 상위 컴포넌트나 react-hook-form과 zod를 사용하여 처리해야 합니다.
 */
interface FormInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  width?: 'small' | 'medium' | 'large' | 'full';
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  value,
  onChange,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  width = 'full',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const displayError = error;
  
  const widthClasses = {
    small: 'w-[var(--input-width-small)]',
    medium: 'w-[var(--input-width-medium)]',
    large: 'w-[var(--input-width-large)]',
    full: 'w-full',
  };

  const errorId = displayError ? `${name}-error` : undefined;
  const helpId = helpText && !displayError ? `${name}-help` : undefined;
  const ariaDescribedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={name} className="mb-1.5 block">
          {label}
          {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
        </Label>
      )}

      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          displayError && 'border-[var(--color-danger)]',
          widthClasses[width]
        )}
        aria-invalid={displayError ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
      />

      {displayError && (
        <p
          id={errorId}
          className="text-[var(--color-danger)] font-[var(--font-family-primary)] mt-1"
          style={{ fontSize: "var(--font-size-sm)" }}
          role="alert"
        >
          {displayError}
        </p>
      )}
      {helpText && !displayError && (
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
