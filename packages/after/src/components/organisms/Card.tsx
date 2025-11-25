import React from 'react';
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { cn } from '@/lib/utils';

/**
 * Card 컴포넌트
 * 
 * shadcn/ui Card를 사용한 카드 컴포넌트입니다.
 */
interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  headerActions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  headerActions,
}) => {
  const variantClasses = {
    default: 'shadow-[var(--shadow-card-default)]',
    bordered: 'border border-[var(--color-border-tertiary)] shadow-none',
    elevated: 'shadow-[var(--shadow-card-elevated)]',
    flat: 'border border-[var(--color-border-quaternary)] shadow-none bg-[var(--color-bg-tertiary)]',
  };

  return (
    <UICard className={cn('card', `card-${variant}`, variantClasses[variant], 'mb-4')}>
      {(title || subtitle || headerActions) && (
        <CardHeader className="card-header">
          <div className="flex justify-between items-center w-full">
            <div>
              {title && <CardTitle className="card-title">{title}</CardTitle>}
              {subtitle && <CardDescription className="card-subtitle">{subtitle}</CardDescription>}
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className="card-body">{children}</CardContent>
    </UICard>
  );
};
