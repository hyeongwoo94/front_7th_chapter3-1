import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

/**
 * FormInput 컴포넌트
 * 
 * shadcn/ui Input과 Label을 조합한 폼 입력 컴포넌트입니다.
 * 검증 로직은 상위 컴포넌트나 react-hook-form과 zod를 사용하여 처리해야 합니다.
 * 
 * @deprecated fieldType, entityType, checkBusinessRules props는 하위 호환성을 위해 유지되지만,
 * 검증 로직은 상위 컴포넌트에서 처리하는 것을 권장합니다.
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

  // @deprecated 검증 로직은 상위 컴포넌트에서 처리하는 것을 권장합니다.
  fieldType?: 'username' | 'email' | 'postTitle' | 'slug' | 'normal';
  entityType?: 'user' | 'post';
  checkBusinessRules?: boolean;
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
  fieldType = 'normal',
  entityType,
  checkBusinessRules = false,
}) => {
  const [internalError, setInternalError] = useState('');

  // @deprecated 검증 로직은 상위 컴포넌트에서 처리하는 것을 권장합니다.
  const validateField = (val: string) => {
    setInternalError('');

    if (!val) return;

    if (fieldType === 'username') {
      if (val.length < 3) {
        setInternalError('사용자명은 3자 이상이어야 합니다');
      } else if (!/^[a-zA-Z0-9_]+$/.test(val)) {
        setInternalError('영문, 숫자, 언더스코어만 사용 가능합니다');
      } else if (val.length > 20) {
        setInternalError('사용자명은 20자 이하여야 합니다');
      }

      if (checkBusinessRules) {
        const reservedWords = ['admin', 'root', 'system', 'administrator'];
        if (reservedWords.includes(val.toLowerCase())) {
          setInternalError('예약된 사용자명입니다');
        }
      }
    } else if (fieldType === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setInternalError('올바른 이메일 형식이 아닙니다');
      }

      if (checkBusinessRules && entityType === 'user') {
        if (!val.endsWith('@company.com') && !val.endsWith('@example.com')) {
          setInternalError('회사 이메일(@company.com 또는 @example.com)만 사용 가능합니다');
        }
      }
    } else if (fieldType === 'postTitle') {
      if (val.length < 5) {
        setInternalError('제목은 5자 이상이어야 합니다');
      } else if (val.length > 100) {
        setInternalError('제목은 100자 이하여야 합니다');
      }

      if (checkBusinessRules && entityType === 'post') {
        const bannedWords = ['광고', '스팸', '홍보'];
        const hasBannedWord = bannedWords.some(word => val.includes(word));
        if (hasBannedWord) {
          setInternalError('제목에 금지된 단어가 포함되어 있습니다');
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    validateField(newValue);
  };

  const displayError = error || internalError;
  
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
