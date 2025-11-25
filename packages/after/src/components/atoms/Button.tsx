import React from "react";
import { Button as UIButton } from "../ui/button";
import { cn } from "@/lib/utils";
import {
    getButtonVariantFromAction,
    getButtonLabelFromAction,
    canDeleteUser,
    canPublishPost,
    canArchivePost,
    type User,
    type Post,
} from "@/lib/business-rules";

/**
 * Button 컴포넌트
 *
 * shadcn/ui Button을 기반으로 하되, 하위 호환성을 위해 일부 도메인 props를 지원합니다.
 * 비즈니스 로직은 별도 유틸리티 함수로 분리되어 있습니다.
 */
interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;

    // 하위 호환성을 위한 도메인 props (권장하지 않음)
    entityType?: "user" | "post";
    action?: "create" | "edit" | "delete" | "publish" | "archive";
    entity?: User | Post;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    size = "md",
    fullWidth = false,
    entityType,
    action,
    entity,
}) => {
    // 비즈니스 규칙 적용
    let actualDisabled = disabled;
    let actualVariant = variant;
    let actualChildren = children;

    if (entityType && action && entity) {
        // 비즈니스 규칙: 관리자는 삭제 불가
        if (entityType === "user" && action === "delete") {
            actualDisabled = canDeleteUser(entity as User) === false;
        }

        // 비즈니스 규칙: 이미 게시된 글은 게시 버튼 비활성화
        if (entityType === "post" && action === "publish") {
            actualDisabled = canPublishPost(entity as Post) === false;
        }

        // 비즈니스 규칙: 게시된 글만 보관 가능
        if (entityType === "post" && action === "archive") {
            actualDisabled = canArchivePost(entity as Post) === false;
        }

        // 자동 label 생성
        if (!children) {
            actualChildren = getButtonLabelFromAction(action, entityType);
        }

        // action에 따라 variant 자동 결정
        actualVariant = getButtonVariantFromAction(action);
    }

    // size 매핑: md -> default
    const sizeMap: Record<string, "sm" | "default" | "lg"> = {
        sm: "sm",
        md: "default",
        lg: "lg",
    };

    return (
        <UIButton
            type={type}
            onClick={onClick}
            disabled={actualDisabled}
            variant={actualVariant}
            size={sizeMap[size]}
            className={cn(fullWidth && "w-full")}
        >
            {actualChildren}
        </UIButton>
    );
};
