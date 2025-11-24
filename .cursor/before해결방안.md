# Before 패키지 문제점 해결방안 명세서

## 개요

이 문서는 `.cursor/before문제점.md`에 명시된 문제점들을 단계별로 해결하기 위한 구체적인 가이드입니다. shadcn/ui 원칙과 현대적인 React 컴포넌트 설계 패턴을 따라 단계적으로 개선합니다.

## 해결 전략 개요

### 마이그레이션 접근 방식

1. **점진적 개선**: 한 번에 모든 것을 바꾸지 않고 단계적으로 개선
2. **하위 호환성 유지**: 기존 API를 유지하면서 내부 구현 개선
3. **테스트 기반**: 각 단계마다 기능이 정상 작동하는지 확인
4. **문서화**: 각 단계의 변경사항과 이유를 명확히 기록

### 우선순위 기반 단계

- **Phase 1**: 기반 구축 (디자인 토큰, 스타일 시스템)
- **Phase 2**: 핵심 컴포넌트 개선 (Button, Badge, Input)
- **Phase 3**: 복합 컴포넌트 개선 (Table, Modal, Card)
- **Phase 4**: 접근성 및 타입 안정성 강화
- **Phase 5**: 최종 정리 및 최적화

---

## Phase 1: 기반 구축 (Foundation)

### 1.1 디자인 토큰 시스템 구축

**목표**: 하드코딩된 스타일 값을 디자인 토큰으로 전환

**현재 상태**: ✅ 이미 완료됨
- `packages/after/src/styles/design-tokens.css` 파일 존재
- `@theme` 블록에 토큰 정의 완료
- Storybook에서 토큰 정상 작동 확인됨

**참고 파일**:
- `.cursor/디자인 토큰 명세서.md` - 토큰 정의 상세 내용

---

#### 단계 1.1.2: Tailwind 설정 확인

**현재 상태**: ✅ 이미 완료됨
- `tailwind.config.js`에서 디자인 토큰 참조 확인됨
- Storybook에서 토큰 정상 로드 확인됨
- PostCSS 설정 완료됨

**확인 사항**:
- [x] `bg-primary`, `text-primary` 같은 클래스가 작동함
- [x] Storybook에서 컬러 토큰이 적용됨

---

### 1.2 유틸리티 함수 설정

**목표**: `cn()` 함수와 CVA 설정

#### 단계 1.2.1: cn() 함수 확인

**현재 상태**: ✅ 이미 완료됨
- `packages/after/src/lib/utils.ts` 파일 존재
- `cn()` 함수가 `clsx`와 `tailwind-merge`를 사용함

**코드 예시**:
```tsx
// packages/after/src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**확인 사항**:
- [x] `cn()` 함수가 정상 작동함
- [x] Tailwind 클래스 충돌이 자동으로 해결됨

---

#### 단계 1.2.2: CVA 패키지 확인

**현재 상태**: ✅ 이미 완료됨
- `class-variance-authority` 패키지가 설치되어 있음 (root package.json 확인)
- shadcn/ui Button에서 이미 사용 중

**확인 사항**:
- [x] CVA 패키지가 설치되어 있음
- [x] 타입 정의가 제대로 import됨

---

## Phase 2: 핵심 컴포넌트 개선 (Core Components)

### 2.1 Button 컴포넌트 개선

**목표**: 도메인 로직 제거 및 순수 UI 컴포넌트로 전환

#### 단계 2.1.1: shadcn/ui Button 확인

**작업 내용**:
1. shadcn/ui Button 컴포넌트가 이미 설치되어 있는지 확인
2. 기존 Button과의 차이점 파악

**확인 사항**:
- [x] `packages/after/src/components/ui/button.tsx` 파일이 이미 존재함
- [ ] Button 컴포넌트가 정상 import되는지 확인
- [ ] shadcn/ui Button의 variant와 size 옵션 확인

---

#### 단계 2.1.2: 도메인 로직 제거

**작업 내용**:
1. before의 Button 컴포넌트 분석
2. 도메인 특화 props 제거 계획 수립
3. 비즈니스 규칙을 상위 컴포넌트로 이동할 위치 파악

**Before 코드 분석**:
```tsx
// ❌ 제거해야 할 props
entityType?: 'user' | 'post';
action?: 'create' | 'edit' | 'delete' | 'publish' | 'archive';
entity?: any;

// ❌ 제거해야 할 로직
if (entityType === 'user' && action === 'delete' && entity.role === 'admin') {
  actualDisabled = true;
}
```

**After 설계**:
```tsx
// ✅ 순수 UI props만 유지
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  // 도메인 로직은 상위 컴포넌트에서 처리
}
```

**작업 단계**:
1. [ ] shadcn/ui Button의 기본 variant 확인
2. [ ] before의 variant를 shadcn/ui variant로 매핑
3. [ ] 도메인 로직을 별도 유틸리티 함수로 추출 계획

---

#### 단계 2.1.3: 비즈니스 규칙 분리

**작업 내용**:
1. 비즈니스 규칙을 별도 파일로 분리
2. 커스텀 훅 또는 유틸리티 함수로 구현

**파일 구조**:
```
packages/after/src/
├── components/
│   └── ui/
│       └── button.tsx          # 순수 UI 컴포넌트
└── lib/
    └── business-rules.ts       # 비즈니스 규칙 유틸리티
```

**코드 예시**:
```tsx
// packages/after/src/lib/business-rules.ts
// 타입 정의 (별도 types 폴더에서 import하거나 여기서 정의)
export interface User {
  id: number;
  role: 'admin' | 'moderator' | 'user';
  // ... 기타 필드
}

export interface Post {
  id: number;
  status: 'draft' | 'published' | 'archived';
  // ... 기타 필드
}

// 비즈니스 규칙 함수들
export function canDeleteUser(user: User): boolean {
  return user.role !== 'admin';
}

export function canPublishPost(post: Post): boolean {
  return post.status !== 'published';
}

export function canArchivePost(post: Post): boolean {
  return post.status === 'published';
}

export function canEditUser(user: User): boolean {
  return user.role !== 'admin';
}

export function canRestorePost(post: Post): boolean {
  return post.status === 'archived';
}
```

**작업 단계**:
1. [ ] 비즈니스 규칙 함수 작성
2. [ ] 각 규칙에 대한 테스트 작성 (선택사항)
3. [ ] 상위 컴포넌트에서 사용 예시 작성

---

#### 단계 2.1.4: Button 컴포넌트 마이그레이션

**작업 내용**:
1. shadcn/ui Button을 기반으로 before의 기능 재현
2. 도메인 로직은 제거하고 순수 UI만 유지

**마이그레이션 체크리스트**:
- [ ] 모든 variant가 정상 작동하는지
- [ ] size prop이 정상 작동하는지
- [ ] disabled 상태가 정상 작동하는지
- [ ] fullWidth 기능이 있는지 (없으면 추가)
- [ ] Storybook에서 테스트

**코드 예시**:
```tsx
// packages/after/src/components/ui/button.tsx
// shadcn/ui Button을 기반으로 커스터마이징
import * as React from "react"
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// fullWidth prop 추가를 위한 확장
export interface ButtonProps 
  extends React.ComponentProps<typeof ShadcnButton>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, fullWidth, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        className={cn(fullWidth && "w-full", className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button"
```

---

### 2.2 Badge 컴포넌트 개선

**목표**: 과도한 조건부 로직 제거 및 단순화

#### 단계 2.2.1: shadcn/ui Badge 추가

**작업 내용**:
1. shadcn/ui Badge 컴포넌트 추가
2. 기존 Badge와의 차이점 파악

```bash
cd packages/after
pnpm dlx shadcn@latest add badge
```

**확인 사항**:
- [ ] `packages/after/src/components/ui/badge.tsx` 파일이 생성되었는지
- [ ] Badge 컴포넌트가 정상 import되는지

---

#### 단계 2.2.2: 도메인 매핑 로직 분리

**작업 내용**:
1. Badge의 복잡한 조건부 로직을 별도 함수로 분리
2. 도메인 특화 props 제거

**Before 분석**:
```tsx
// ❌ 제거해야 할 props
status?: 'published' | 'draft' | 'archived' | 'pending' | 'rejected';
userRole?: 'admin' | 'moderator' | 'user' | 'guest';
priority?: 'high' | 'medium' | 'low';
paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
```

**After 설계**:
```tsx
// ✅ 순수 UI props만
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  // 도메인 매핑은 상위 컴포넌트에서
}
```

**도메인 매핑 유틸리티**:
```tsx
// packages/after/src/lib/badge-mappers.ts
export function getBadgeVariantFromStatus(
  status: 'published' | 'draft' | 'archived' | 'pending' | 'rejected'
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const mapping = {
    published: 'default',
    draft: 'outline',
    archived: 'secondary',
    pending: 'outline',
    rejected: 'destructive',
  } as const;
  
  return mapping[status];
}

export function getBadgeLabelFromStatus(
  status: 'published' | 'draft' | 'archived' | 'pending' | 'rejected'
): string {
  const mapping = {
    published: '게시됨',
    draft: '임시저장',
    archived: '보관됨',
    pending: '대기중',
    rejected: '거부됨',
  } as const;
  
  return mapping[status];
}
```

**작업 단계**:
1. [ ] 도메인 매핑 함수 작성
2. [ ] Badge 컴포넌트는 variant와 children만 받도록 수정
3. [ ] 상위 컴포넌트에서 매핑 함수 사용 예시 작성

---

### 2.3 FormInput 컴포넌트 개선

**목표**: 검증 로직 분리 및 순수 UI 컴포넌트로 전환

#### 단계 2.3.1: shadcn/ui Input 확인

**작업 내용**:
1. shadcn/ui Input, Label, Form 컴포넌트가 이미 설치되어 있는지 확인
2. 기존 FormInput과의 차이점 파악

**확인 사항**:
- [x] `packages/after/src/components/ui/input.tsx` 파일이 이미 존재함
- [x] `packages/after/src/components/ui/label.tsx` 파일이 이미 존재함
- [x] `packages/after/src/components/ui/form.tsx` 파일이 이미 존재함
- [ ] 컴포넌트들이 정상 import되는지 확인

---

#### 단계 2.3.2: 검증 로직 분리

**작업 내용**:
1. react-hook-form과 zod 설치
2. 검증 스키마를 별도 파일로 분리

**패키지 설치**:
```bash
pnpm add react-hook-form @hookform/resolvers zod
```

**검증 스키마 분리**:
```tsx
// packages/after/src/lib/validation-schemas.ts
import { z } from "zod"

export const usernameSchema = z
  .string()
  .min(3, "사용자명은 3자 이상이어야 합니다")
  .max(20, "사용자명은 20자 이하여야 합니다")
  .regex(/^[a-zA-Z0-9_]+$/, "영문, 숫자, 언더스코어만 사용 가능합니다")
  .refine(
    (val) => !['admin', 'root', 'system', 'administrator'].includes(val.toLowerCase()),
    "예약된 사용자명입니다"
  )

export const emailSchema = z
  .string()
  .email("올바른 이메일 형식이 아닙니다")
  .refine(
    (val) => val.endsWith('@company.com') || val.endsWith('@example.com'),
    "회사 이메일(@company.com 또는 @example.com)만 사용 가능합니다"
  )

export const postTitleSchema = z
  .string()
  .min(5, "제목은 5자 이상이어야 합니다")
  .max(100, "제목은 100자 이하여야 합니다")
  .refine(
    (val) => !['광고', '스팸', '홍보'].some(word => val.includes(word)),
    "제목에 금지된 단어가 포함되어 있습니다"
  )
```

**작업 단계**:
1. [ ] 필요한 패키지 설치
2. [ ] 검증 스키마 작성
3. [ ] FormInput 컴포넌트는 error, helperText만 받도록 수정

---

#### 단계 2.3.3: FormInput 컴포넌트 마이그레이션

**작업 내용**:
1. shadcn/ui Input과 Label을 조합하여 FormInput 재구성
2. 검증은 react-hook-form으로 처리

**코드 예시**:
```tsx
// packages/after/src/components/molecules/FormInput.tsx
import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormInputProps 
  extends Omit<React.ComponentProps<typeof Input>, 'id' | 'name'> {
  name: string;
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, error, helpText, required, className, ...inputProps }, ref) => {
    const errorId = error ? `${name}-error` : undefined;
    const helpId = helpText && !error ? `${name}-help` : undefined;
    const ariaDescribedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <Input
          id={name}
          name={name}
          ref={ref}
          className={cn(error && "border-destructive", className)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          {...inputProps}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={helpId} className="text-sm text-muted-foreground">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput"
```

---

## Phase 3: 복합 컴포넌트 개선 (Complex Components)

### 3.1 Table 컴포넌트 개선

**목표**: 도메인 로직 제거 및 컴포넌트 조합 패턴 적용

#### 단계 3.1.1: shadcn/ui Table 확인

**작업 내용**:
1. shadcn/ui Table 컴포넌트가 이미 설치되어 있는지 확인
2. 기존 Table과의 차이점 파악

**확인 사항**:
- [x] `packages/after/src/components/ui/table.tsx` 파일이 이미 존재함
- [ ] Table 컴포넌트가 정상 import되는지 확인
- [ ] TableHeader, TableBody, TableRow, TableHead, TableCell 컴포넌트 확인

---

#### 단계 3.1.2: 타입 안정성 개선

**작업 내용**:
1. `any` 타입을 제네릭으로 교체
2. 명확한 인터페이스 정의

**Before**:
```tsx
// ❌
interface TableProps {
  data?: any[];
  onRowClick?: (row: any) => void;
}
```

**After**:
```tsx
// ✅ shadcn/ui Table은 컴포넌트 조합 패턴 사용
// Table 자체는 제네릭이 필요 없고, 데이터는 상위에서 처리
import {
  Table as ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

// 사용 예시:
<ShadcnTable>
  <TableHeader>
    <TableRow>
      <TableHead>이름</TableHead>
      <TableHead>액션</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id} onClick={() => onRowClick?.(row)}>
        <TableCell>{row.name}</TableCell>
        <TableCell>
          {/* 액션 버튼들 */}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</ShadcnTable>
```

---

#### 단계 3.1.3: 상태 관리 분리

**작업 내용**:
1. 정렬, 검색, 페이지네이션 상태를 커스텀 훅으로 분리
2. 제어 컴포넌트 패턴 적용

**커스텀 훅 생성**:
```tsx
// packages/after/src/hooks/useTable.ts
import { useState, useMemo } from "react"

export function useTable<T>({
  data,
  pageSize = 10,
  initialSort,
}: {
  data: T[];
  pageSize?: number;
  initialSort?: { column: keyof T; direction: 'asc' | 'desc' };
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | ''>(initialSort?.column || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    initialSort?.direction || 'asc'
  );

  // 검색 필터링
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // 정렬
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortColumn, sortDirection]);

  // 페이지네이션
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // 정렬 시 첫 페이지로
  };

  return {
    paginatedData,
    currentPage,
    totalPages,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    handleSort,
  };
}
```

---

#### 단계 3.1.4: 도메인 액션 제거

**작업 내용**:
1. `onEdit`, `onDelete` 같은 도메인 특화 props 제거
2. 액션 버튼은 TableCell 내부에 별도 컴포넌트로 구성

**Before**:
```tsx
// ❌
<Table 
  entityType="user"
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**After**:
```tsx
// ✅ shadcn/ui Table은 컴포넌트 조합 패턴 사용
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>이름</TableHead>
      <TableHead>이메일</TableHead>
      <TableHead>액션</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map(user => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
              수정
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(user.id)}
              disabled={!canDeleteUser(user)}
            >
              삭제
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### 3.2 Modal 컴포넌트 개선

**목표**: 접근성 개선 및 Radix UI 사용

#### 단계 3.2.1: shadcn/ui Dialog 추가

**작업 내용**:
```bash
pnpm dlx shadcn@latest add dialog
```

**이유**: shadcn/ui Dialog는 Radix UI 기반으로 접근성이 자동으로 처리됨

---

#### 단계 3.2.2: 접근성 기능 확인

**확인 사항**:
- [ ] 포커스 트랩이 자동으로 작동하는지
- [ ] ESC 키로 닫기가 작동하는지
- [ ] ARIA 속성이 자동으로 적용되는지
- [ ] 스크린 리더에서 모달임을 인식하는지

---

### 3.3 Card 컴포넌트 개선

**목표**: shadcn/ui Card로 전환

#### 단계 3.3.1: shadcn/ui Card 확인

**작업 내용**:
1. shadcn/ui Card 컴포넌트가 이미 설치되어 있는지 확인
2. 기존 Card와의 차이점 파악

**확인 사항**:
- [x] `packages/after/src/components/ui/card.tsx` 파일이 이미 존재함
- [ ] Card, CardHeader, CardTitle, CardDescription, CardContent 컴포넌트 확인

---

#### 단계 3.3.2: Card 컴포넌트 마이그레이션

**작업 내용**:
1. before의 Card variant를 shadcn/ui Card로 매핑
2. 스타일을 Tailwind 클래스로 전환

**Before**:
```tsx
<Card variant="default" title="제목" subtitle="부제목">
  내용
</Card>
```

**After**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>부제목</CardDescription>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

---

## Phase 4: 접근성 및 타입 안정성 강화

### 4.1 접근성 개선

#### 단계 4.1.1: ARIA 속성 추가

**작업 내용**:
1. 모든 버튼에 `aria-label` 추가
2. 아이콘만 있는 버튼은 반드시 `aria-label` 필요
3. 폼 요소에 `aria-describedby` 추가

**체크리스트**:
- [ ] 모든 버튼에 적절한 `aria-label` 또는 텍스트가 있는지
- [ ] 에러 메시지가 `aria-describedby`로 연결되어 있는지
- [ ] 모달이 `role="dialog"`와 `aria-modal`을 가지고 있는지

---

#### 단계 4.1.2: 키보드 네비게이션 확인

**작업 내용**:
1. Tab 키로 모든 인터랙티브 요소에 접근 가능한지 확인
2. Enter/Space 키로 버튼 클릭이 가능한지 확인
3. ESC 키로 모달/다이얼로그가 닫히는지 확인

**체크리스트**:
- [ ] 모든 버튼이 키보드로 접근 가능한지
- [ ] 포커스 순서가 논리적인지
- [ ] 포커스 스타일이 명확한지

---

### 4.2 타입 안정성 강화

#### 단계 4.2.1: any 타입 제거

**작업 내용**:
1. 모든 `any` 타입을 명확한 타입으로 교체
2. 제네릭 타입 활용
3. 타입 가드 함수 작성

**체크리스트**:
- [ ] `any` 타입이 없는지
- [ ] 모든 함수의 매개변수와 반환값이 타입이 명시되어 있는지
- [ ] IDE에서 자동완성이 정상 작동하는지

---

#### 단계 4.2.2: 타입 정의 파일 정리

**작업 내용**:
1. 공통 타입을 `types/` 폴더로 분리
2. 도메인 타입과 UI 타입 분리

**파일 구조**:
```
packages/after/src/
├── types/
│   ├── user.ts
│   ├── post.ts
│   └── common.ts
└── components/
```

---

## Phase 5: 최종 정리 및 최적화

### 5.1 코드 품질 개선

#### 단계 5.1.1: 사용하지 않는 코드 제거

**작업 내용**:
1. 사용하지 않는 props 제거
2. 주석 처리된 코드 제거
3. 사용하지 않는 import 제거

---

#### 단계 5.1.2: 일관성 검토

**작업 내용**:
1. 모든 컴포넌트의 API 일관성 확인
2. 네이밍 컨벤션 통일
3. 파일 구조 일관성 확인

---

### 5.2 문서화

#### 단계 5.2.1: Storybook 스토리 작성

**작업 내용**:
1. 모든 컴포넌트에 Storybook 스토리 작성
2. 다양한 variant와 상태를 보여주는 스토리 작성
3. 사용 예시 문서화

---

#### 단계 5.2.2: README 작성

**작업 내용**:
1. 컴포넌트 사용법 문서화
2. 마이그레이션 가이드 작성
3. 비즈니스 규칙 사용법 문서화

---

## 마이그레이션 체크리스트

### 전체 진행 상황

#### Phase 1: 기반 구축
- [ ] 디자인 토큰 시스템 구축 완료
- [ ] 유틸리티 함수 설정 완료
- [ ] Tailwind CSS 설정 완료

#### Phase 2: 핵심 컴포넌트
- [ ] Button 컴포넌트 개선 완료
- [ ] Badge 컴포넌트 개선 완료
- [ ] FormInput 컴포넌트 개선 완료

#### Phase 3: 복합 컴포넌트
- [ ] Table 컴포넌트 개선 완료
- [ ] Modal 컴포넌트 개선 완료
- [ ] Card 컴포넌트 개선 완료

#### Phase 4: 접근성 및 타입
- [ ] 접근성 개선 완료
- [ ] 타입 안정성 강화 완료

#### Phase 5: 최종 정리
- [ ] 코드 품질 개선 완료
- [ ] 문서화 완료

---

## 각 단계별 검증 방법

### 컴포넌트 검증

1. **시각적 검증**: Storybook에서 before와 after 비교
2. **기능 검증**: ManagementPage에서 실제 사용 테스트
3. **타입 검증**: TypeScript 컴파일 오류 확인
4. **접근성 검증**: 브라우저 개발자 도구의 접근성 검사기 사용

### 테스트 시나리오

1. **기본 사용**: 모든 variant와 size 테스트
2. **에지 케이스**: disabled, error 상태 테스트
3. **키보드 네비게이션**: Tab, Enter, ESC 키 테스트
4. **반응형**: 다양한 화면 크기에서 테스트

---

## 주의사항

### 마이그레이션 시 주의할 점

1. **점진적 마이그레이션**: 한 번에 모든 것을 바꾸지 말고 단계적으로
2. **기능 유지**: 기존 기능이 정상 작동하는지 항상 확인
3. **성능 모니터링**: 마이그레이션 후 성능 저하가 없는지 확인
4. **사용자 피드백**: 가능하면 실제 사용자에게 테스트 요청

### 롤백 계획

각 Phase 완료 후:
1. Git 커밋으로 변경사항 저장
2. 문제 발생 시 이전 버전으로 롤백 가능하도록 준비
3. 주요 변경사항은 별도 브랜치에서 작업

---

## 참고 자료

- [문제점 명세서](./before문제점.md)
- [디자인 토큰 명세서](./디자인 토큰 명세서.md)
- [shadcn/ui 가이드](./shadcn-ui-guide.md)
- [과제 수행 가이드](./assignment-guide.md)
- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Radix UI 문서](https://www.radix-ui.com)
- [React Hook Form 문서](https://react-hook-form.com)
- [Zod 문서](https://zod.dev)

---

**작성일**: 2024년  
**대상**: `packages/before` → `packages/after` 마이그레이션  
**목표**: shadcn/ui 원칙에 따른 현대적인 컴포넌트 시스템 구축

