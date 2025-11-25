/**
 * Badge 도메인 매핑 유틸리티
 * 
 * 도메인 특화 props를 Badge variant로 변환합니다.
 */

export type BadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info";

export function getBadgeVariantFromStatus(
  status: "published" | "draft" | "archived" | "pending" | "rejected"
): BadgeVariant {
  const mapping: Record<string, BadgeVariant> = {
    published: "success",
    draft: "warning",
    archived: "secondary",
    pending: "info",
    rejected: "danger",
  };

  return mapping[status] || "primary";
}

export function getBadgeLabelFromStatus(
  status: "published" | "draft" | "archived" | "pending" | "rejected"
): string {
  const mapping: Record<string, string> = {
    published: "게시됨",
    draft: "임시저장",
    archived: "보관됨",
    pending: "대기중",
    rejected: "거부됨",
  };

  return mapping[status] || status;
}

export function getBadgeVariantFromUserRole(
  userRole: "admin" | "moderator" | "user" | "guest"
): BadgeVariant {
  const mapping: Record<string, BadgeVariant> = {
    admin: "danger",
    moderator: "warning",
    user: "primary",
    guest: "secondary",
  };

  return mapping[userRole] || "primary";
}

export function getBadgeLabelFromUserRole(
  userRole: "admin" | "moderator" | "user" | "guest"
): string {
  const mapping: Record<string, string> = {
    admin: "관리자",
    moderator: "운영자",
    user: "사용자",
    guest: "게스트",
  };

  return mapping[userRole] || userRole;
}

export function getBadgeVariantFromPriority(
  priority: "high" | "medium" | "low"
): BadgeVariant {
  const mapping: Record<string, BadgeVariant> = {
    high: "danger",
    medium: "warning",
    low: "info",
  };

  return mapping[priority] || "primary";
}

export function getBadgeLabelFromPriority(
  priority: "high" | "medium" | "low"
): string {
  const mapping: Record<string, string> = {
    high: "높음",
    medium: "보통",
    low: "낮음",
  };

  return mapping[priority] || priority;
}

export function getBadgeVariantFromPaymentStatus(
  paymentStatus: "paid" | "pending" | "failed" | "refunded"
): BadgeVariant {
  const mapping: Record<string, BadgeVariant> = {
    paid: "success",
    pending: "warning",
    failed: "danger",
    refunded: "secondary",
  };

  return mapping[paymentStatus] || "primary";
}

export function getBadgeLabelFromPaymentStatus(
  paymentStatus: "paid" | "pending" | "failed" | "refunded"
): string {
  const mapping: Record<string, string> = {
    paid: "결제완료",
    pending: "결제대기",
    failed: "결제실패",
    refunded: "환불됨",
  };

  return mapping[paymentStatus] || paymentStatus;
}

