import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

/**
 * FormCheckbox 컴포넌트
 * 
 * shadcn/ui Checkbox와 Label을 조합한 폼 체크박스 컴포넌트입니다.
 */
interface FormCheckboxProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  checked,
  onChange,
  label,
  disabled = false,
  error,
  hint,
}) => {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint && !error ? `${name}-hint` : undefined;
  const ariaDescribedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="mb-3">
      <div className={cn(
        "flex items-start cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed"
      )}>
        <div className="relative mr-2 mt-0.5">
          <Checkbox
            id={name}
            name={name}
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            aria-describedby={ariaDescribedBy}
            aria-invalid={error ? 'true' : undefined}
          />
        </div>
        <Label
          htmlFor={name}
          className={cn(
            "text-[var(--color-text-secondary)] cursor-pointer leading-[var(--line-height-normal)] select-none font-[var(--font-family-secondary)]",
            error && "text-[var(--color-danger)]",
            disabled && "cursor-not-allowed"
          )}
          style={{ fontSize: "var(--font-size-md)" }}
        >
          {label}
        </Label>
      </div>

      {error && (
        <span
          id={errorId}
          className="block text-[var(--color-danger)] font-[var(--font-family-secondary)] mt-0.5 ml-[24px]"
          style={{ fontSize: "var(--font-size-sm)" }}
        >
          {error}
        </span>
      )}
      {hint && !error && (
        <span
          id={hintId}
          className="block text-[var(--color-text-tertiary)] font-[var(--font-family-secondary)] mt-0.5 ml-[24px]"
          style={{ fontSize: "var(--font-size-sm)" }}
        >
          {hint}
        </span>
      )}
    </div>
  );
};
