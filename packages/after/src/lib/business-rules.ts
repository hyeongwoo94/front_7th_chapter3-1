/**
 * 비즈니스 규칙 유틸리티
 * 
 * UI 컴포넌트에서 분리된 비즈니스 로직을 관리합니다.
 */

export interface User {
  id: number;
  role: "admin" | "moderator" | "user";
  [key: string]: any;
}

export interface Post {
  id: number;
  status: "draft" | "published" | "archived";
  [key: string]: any;
}

// 사용자 관련 비즈니스 규칙
export function canDeleteUser(user: User): boolean {
  return user.role !== "admin";
}

export function canEditUser(user: User): boolean {
  return user.role !== "admin";
}

// 게시글 관련 비즈니스 규칙
export function canPublishPost(post: Post): boolean {
  return post.status !== "published";
}

export function canArchivePost(post: Post): boolean {
  return post.status === "published";
}

export function canRestorePost(post: Post): boolean {
  return post.status === "archived";
}

// 액션에 따른 버튼 variant 결정
export function getButtonVariantFromAction(
  action: "create" | "edit" | "delete" | "publish" | "archive"
): "primary" | "secondary" | "danger" | "success" {
  switch (action) {
    case "delete":
      return "danger";
    case "publish":
      return "success";
    case "archive":
      return "secondary";
    default:
      return "primary";
  }
}

// 액션에 따른 버튼 라벨 생성
export function getButtonLabelFromAction(
  action: "create" | "edit" | "delete" | "publish" | "archive",
  entityType?: "user" | "post"
): string {
  switch (action) {
    case "create":
      return `새 ${entityType === "user" ? "사용자" : "게시글"} 만들기`;
    case "edit":
      return "수정";
    case "delete":
      return "삭제";
    case "publish":
      return "게시";
    case "archive":
      return "보관";
    default:
      return "";
  }
}

