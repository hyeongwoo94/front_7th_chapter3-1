import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Header 컴포넌트
 *
 * 디자인 토큰을 사용하여 스타일링된 헤더 컴포넌트입니다.
 */
export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // theme-color meta 태그 업데이트 - CSS 변수에서 가져오기
    const updateThemeColor = () => {
      const computedStyle = getComputedStyle(root);
      const themeColor = computedStyle.getPropertyValue("--theme-color").trim();

      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement("meta");
        themeColorMeta.setAttribute("name", "theme-color");
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute("content", themeColor);
    };

    // CSS가 적용된 후 실행
    requestAnimationFrame(() => {
      setTimeout(updateThemeColor, 0);
    });
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };
  return (
    <header
      className={cn(
        "bg-[var(--color-bg-primary)]",
        "border-b border-[var(--color-border-secondary)]",
        "shadow-[var(--shadow-header)]",
        "sticky top-0",
        "z-[var(--z-index-header)]",
        "mx-auto"
      )}
    >
      <div
        className={cn(
          "max-w-[var(--header-max-width)]",
          "mx-auto",
          "px-6",
          "flex justify-between items-center",
          "h-[var(--header-height)]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-[var(--logo-gap)]">
          <div
            className={cn(
              "w-[var(--logo-size)]",
              "h-[var(--logo-size)]",
              "bg-[var(--color-primary)]",
              "rounded-lg",
              "flex items-center justify-center",
              "text-white font-bold text-[20px]"
            )}
          >
            L
          </div>
          <div>
            <h1
              className={cn(
                "text-lg font-bold text-[var(--color-text-primary)] m-0 leading-none"
              )}
            >
              Hanghae Company
            </h1>
            <p
              className={cn(
                "text-[11px] text-[var(--color-text-tertiary)] m-0 leading-none mt-0.5"
              )}
            >
              Design System Migration Project
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div
              className="font-semibold text-[var(--color-text-primary)]"
              style={{ fontSize: "var(--font-size-md)" }}
            >
              Demo User
            </div>
            <div
              className="text-[var(--color-text-tertiary)]"
              style={{ fontSize: "var(--font-size-sm)" }}
            >
              demo@example.com
            </div>
          </div>
          <div
            className={cn(
              "w-[var(--logo-size)]",
              "h-[var(--logo-size)]",
              "rounded-full",
              "bg-[var(--color-info-bg)]",
              "flex items-center justify-center",
              "text-[var(--color-primary)] font-semibold text-base"
            )}
          >
            DU
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
