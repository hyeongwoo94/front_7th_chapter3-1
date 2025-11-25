import React from 'react';
import { Badge as UIBadge } from '../ui/badge';
import {
  getBadgeVariantFromStatus,
  getBadgeLabelFromStatus,
  getBadgeVariantFromUserRole,
  getBadgeLabelFromUserRole,
  getBadgeVariantFromPriority,
  getBadgeLabelFromPriority,
  getBadgeVariantFromPaymentStatus,
  getBadgeLabelFromPaymentStatus,
} from '@/lib/badge-mappers';

/**
 * Badge 컴포넌트
 * 
 * shadcn/ui Badge를 기반으로 하되, 하위 호환성을 위해 일부 도메인 props를 지원합니다.
 * 도메인 매핑은 별도 유틸리티 함수로 분리되어 있습니다.
 */
interface BadgeProps {
  children?: React.ReactNode;
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  pill?: boolean;
  status?: 'published' | 'draft' | 'archived' | 'pending' | 'rejected';
  userRole?: 'admin' | 'moderator' | 'user' | 'guest';
  priority?: 'high' | 'medium' | 'low';
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  type = 'primary',
  size = 'medium',
  pill = false,
  status,
  userRole,
  priority,
  paymentStatus,
  showIcon = false,
}) => {
  void showIcon; // 향후 아이콘 기능 추가 시 사용

  let actualVariant = type;
  let actualContent = children;

  // 도메인 매핑 적용
  if (status) {
    actualVariant = getBadgeVariantFromStatus(status);
    actualContent = actualContent || getBadgeLabelFromStatus(status);
  } else if (userRole) {
    actualVariant = getBadgeVariantFromUserRole(userRole);
    actualContent = actualContent || getBadgeLabelFromUserRole(userRole);
  } else if (priority) {
    actualVariant = getBadgeVariantFromPriority(priority);
    actualContent = actualContent || getBadgeLabelFromPriority(priority);
  } else if (paymentStatus) {
    actualVariant = getBadgeVariantFromPaymentStatus(paymentStatus);
    actualContent = actualContent || getBadgeLabelFromPaymentStatus(paymentStatus);
  }

  // size 매핑
  const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  };

  return (
    <UIBadge
      variant={actualVariant}
      size={sizeMap[size]}
      pill={pill}
    >
      {actualContent}
    </UIBadge>
  );
};
