/**
 * 테이블 컬럼 정의
 * 
 * UI 컴포넌트에서 분리된 테이블 컬럼 설정을 관리합니다.
 */

export type TableColumn = {
  key: string;
  header: string;
  width?: string;
};

/**
 * 사용자 테이블 컬럼 정의
 */
export function getUserTableColumns(): TableColumn[] {
  return [
    { key: "id", header: "ID", width: "60px" },
    { key: "username", header: "사용자명", width: "150px" },
    { key: "email", header: "이메일" },
    { key: "role", header: "역할", width: "120px" },
    { key: "status", header: "상태", width: "120px" },
    { key: "createdAt", header: "생성일", width: "120px" },
    { key: "lastLogin", header: "마지막 로그인", width: "140px" },
    { key: "actions", header: "관리", width: "200px" },
  ];
}

/**
 * 게시글 테이블 컬럼 정의
 */
export function getPostTableColumns(): TableColumn[] {
  return [
    { key: "id", header: "ID", width: "60px" },
    { key: "title", header: "제목" },
    { key: "author", header: "작성자", width: "120px" },
    { key: "category", header: "카테고리", width: "140px" },
    { key: "status", header: "상태", width: "120px" },
    { key: "views", header: "조회수", width: "100px" },
    { key: "createdAt", header: "작성일", width: "120px" },
    { key: "actions", header: "관리", width: "250px" },
  ];
}

