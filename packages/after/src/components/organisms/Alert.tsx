import React from 'react';
import {
  Alert as UIAlert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  AlertClose,
} from '../ui/alert';
import { cn } from '@/lib/utils';

/**
 * Alert 컴포넌트
 * 
 * shadcn/ui Alert를 사용한 알림 컴포넌트입니다.
 */
interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default';
  title?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'default',
  title,
  onClose,
  showIcon = true,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'info': return 'ℹ️';
      case 'success': return '✓';
      case 'warning': return '⚠️';
      case 'error': return '✕';
      default: return '•';
    }
  };

  return (
    <UIAlert
      variant={variant}
      className={cn('alert', `alert-${variant}`)}
    >
      {showIcon && <AlertIcon className="alert-icon">{getIcon()}</AlertIcon>}
      <AlertDescription className="alert-content">
        {title && <AlertTitle className="alert-title">{title}</AlertTitle>}
        <div className="alert-body">{children}</div>
      </AlertDescription>
      {onClose && (
        <AlertClose onClick={onClose} className="alert-close">
          ×
        </AlertClose>
      )}
    </UIAlert>
  );
};
