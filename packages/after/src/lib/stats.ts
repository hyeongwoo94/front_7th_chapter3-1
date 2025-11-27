햐/**
 * 통계 계산 로직
 * 
 * UI 컴포넌트에서 분리된 통계 계산 비즈니스 로직을 관리합니다.
 */

import type { User } from "../services/userService";
import type { Post } from "../services/postService";

export type StatItem = {
  label: string;
  value: number;
  color: string;
};

export type Stats = {
  total: number;
  stat1: StatItem;
  stat2: StatItem;
  stat3: StatItem;
  stat4: StatItem;
};

/**
 * 사용자 통계 계산
 */
export function calculateUserStats(users: User[]): Stats {
  return {
    total: users.length,
    stat1: {
      label: "활성",
      value: users.filter((u) => u.status === "active").length,
      color: "var(--color-success)",
    },
    stat2: {
      label: "비활성",
      value: users.filter((u) => u.status === "inactive").length,
      color: "var(--color-warning)",
    },
    stat3: {
      label: "정지",
      value: users.filter((u) => u.status === "suspended").length,
      color: "var(--color-danger)",
    },
    stat4: {
      label: "관리자",
      value: users.filter((u) => u.role === "admin").length,
      color: "var(--color-primary)",
    },
  };
}

/**
 * 게시글 통계 계산
 */
export function calculatePostStats(posts: Post[]): Stats {
  return {
    total: posts.length,
    stat1: {
      label: "게시됨",
      value: posts.filter((p) => p.status === "published").length,
      color: "var(--color-success)",
    },
    stat2: {
      label: "임시저장",
      value: posts.filter((p) => p.status === "draft").length,
      color: "var(--color-warning)",
    },
    stat3: {
      label: "보관됨",
      value: posts.filter((p) => p.status === "archived").length,
      color: "var(--color-text-disabled)",
    },
    stat4: {
      label: "총 조회수",
      value: posts.reduce((sum, p) => sum + p.views, 0),
      color: "var(--color-primary)",
    },
  };
}

