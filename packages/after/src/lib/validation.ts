/**
 * 폼 검증 로직
 * 
 * UI 컴포넌트에서 분리된 폼 검증 비즈니스 로직을 관리합니다.
 */

export type UserFormData = {
  username?: string;
  email?: string;
  role?: "admin" | "moderator" | "user";
  status?: "active" | "inactive" | "suspended";
};

export type PostFormData = {
  title?: string;
  content?: string;
  author?: string;
  category?: string;
  status?: "draft" | "published" | "archived";
};

/**
 * 사용자 폼 데이터 검증
 */
export function validateUserForm(data: UserFormData): { isValid: boolean; error?: string } {
  if (!data.username || !data.email) {
    return { isValid: false, error: "사용자명과 이메일은 필수입니다" };
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, error: "올바른 이메일 형식이 아닙니다" };
  }

  // 사용자명 길이 검증
  if (data.username.length < 3) {
    return { isValid: false, error: "사용자명은 3자 이상이어야 합니다" };
  }

  if (data.username.length > 20) {
    return { isValid: false, error: "사용자명은 20자 이하여야 합니다" };
  }

  // 사용자명 형식 검증 (영문, 숫자, 언더스코어만)
  if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    return { isValid: false, error: "영문, 숫자, 언더스코어만 사용 가능합니다" };
  }

  return { isValid: true };
}

/**
 * 게시글 폼 데이터 검증
 */
export function validatePostForm(data: PostFormData): { isValid: boolean; error?: string } {
  if (!data.title || !data.author || !data.category) {
    return { isValid: false, error: "제목, 작성자, 카테고리는 필수입니다" };
  }

  // 제목 길이 검증
  if (data.title.length < 5) {
    return { isValid: false, error: "제목은 5자 이상이어야 합니다" };
  }

  if (data.title.length > 100) {
    return { isValid: false, error: "제목은 100자 이하여야 합니다" };
  }

  return { isValid: true };
}

