# shadcn/ui 가이드

## 📋 목차
1. [shadcn/ui란?](#shadcnui란)
2. [언제 사용하는가?](#언제-사용하는가)
3. [다른 라이브러리와의 차이점](#다른-라이브러리와의-차이점)
4. [설치 및 설정](#설치-및-설정)
5. [사용 방법](#사용-방법)
6. [컴포넌트 추가하기](#컴포넌트-추가하기)
7. [컴포넌트 커스터마이징](#컴포넌트-커스터마이징)
8. [실전 예시](#실전-예시)
9. [자주 묻는 질문](#자주-묻는-질문)

---

## shadcn/ui란?

**shadcn/ui**는 React 컴포넌트 라이브러리입니다. 하지만 일반적인 npm 패키지와는 다른 방식으로 작동합니다.

### 핵심 개념

- ✅ **복사 기반 (Copy-based)**: 컴포넌트 코드가 프로젝트에 직접 복사됨
- ✅ **완전한 소유권**: 코드를 완전히 소유하고 자유롭게 수정 가능
- ✅ **Tailwind CSS 기반**: 모든 스타일이 Tailwind CSS로 작성됨
- ✅ **TypeScript 지원**: 완벽한 타입 안정성 제공
- ✅ **접근성 (A11y)**: Radix UI 기반으로 접근성 고려

### 주요 특징

1. **프로젝트에 코드가 복사됨**
   - 다른 라이브러리처럼 `node_modules`에 설치되지 않음
   - `src/components/ui/` 폴더에 컴포넌트 파일이 생성됨

2. **완전한 커스터마이징 가능**
   - 필요에 따라 코드를 직접 수정 가능
   - 디자인 시스템에 맞게 자유롭게 변경 가능

3. **Tailwind CSS와 완벽 통합**
   - 모든 스타일이 Tailwind 클래스로 작성됨
   - 테마 변수로 색상 시스템 커스터마이징 가능

---

## 언제 사용하는가?

### ✅ 사용하기 좋은 경우

1. **빠른 프로토타이핑**
   - 높은 품질의 컴포넌트를 빠르게 사용하고 싶을 때

2. **디자인 시스템 구축**
   - 기업용 디자인 시스템을 만들 때
   - 일관된 UI 컴포넌트가 필요할 때

3. **커스터마이징이 중요한 경우**
   - 프로젝트에 맞게 컴포넌트를 수정해야 할 때
   - 디자인 가이드라인을 정확히 따라야 할 때

4. **Tailwind CSS를 사용하는 프로젝트**
   - 이미 Tailwind CSS를 사용 중일 때
   - Tailwind와 통합된 컴포넌트를 원할 때

5. **접근성이 중요한 경우**
   - Radix UI 기반으로 접근성을 자동으로 고려함

### ❌ 사용하지 않는 것이 좋은 경우

1. **번들 크기가 매우 중요한 경우**
   - 필요한 컴포넌트만 선택적으로 사용하지만, 여전히 코드가 포함됨

2. **순수 CSS를 사용하는 프로젝트**
   - Tailwind CSS 없이는 사용 불가능

3. **기존 컴포넌트 라이브러리가 있는 경우**
   - Material-UI, Ant Design 등이 이미 구축되어 있다면 중복될 수 있음

---

## 다른 라이브러리와의 차이점

### vs Material-UI, Ant Design

| 특징 | Material-UI / Ant Design | shadcn/ui |
|------|-------------------------|-----------|
| 설치 방식 | `npm install` 한 번 | 컴포넌트마다 추가 |
| 코드 위치 | `node_modules` | 프로젝트 소스 코드 |
| 커스터마이징 | 제한적 | 완전히 수정 가능 |
| 번들 크기 | 모든 컴포넌트 포함 | 사용하는 것만 포함 |
| 업데이트 | 라이브러리 업데이트 | 직접 관리 |

### vs 일반 npm 패키지

```bash
# 일반 npm 패키지
npm install some-library
# → node_modules에 설치됨
# → 사용법: import { Component } from 'some-library'

# shadcn/ui
pnpm dlx shadcn@latest add button
# → src/components/ui/button.tsx 파일이 생성됨
# → 사용법: import { Button } from '@/components/ui/button'
```

---

## 설치 및 설정

### 현재 프로젝트 설정 상태

현재 프로젝트는 이미 shadcn/ui가 설정되어 있습니다:

- ✅ `components.json` 설정 파일 존재
- ✅ Tailwind CSS 설정 완료
- ✅ 필요한 의존성 설치됨
- ✅ `lib/utils.ts` 유틸리티 함수 준비됨

### 설정 파일 위치

- **컴포넌트 설정**: `/components.json` (루트)
- **Tailwind 설정**: `/tailwind.config.js` (루트)
- **CSS 변수**: `/packages/after/src/styles/globals.css`
- **컴포넌트 저장 위치**: `/packages/after/src/components/ui/`
- **유틸리티 함수**: `/packages/after/src/lib/utils.ts`

---

## 사용 방법

### 1. 컴포넌트 추가하기

터미널에서 필요한 컴포넌트를 추가합니다:

```bash
# 단일 컴포넌트 추가
pnpm dlx shadcn@latest add button

# 여러 컴포넌트 한 번에 추가
pnpm dlx shadcn@latest add card input dialog

# 특정 컴포넌트만 추가 (예: form)
pnpm dlx shadcn@latest add form
```

### 2. 컴포넌트 import 및 사용

컴포넌트가 추가되면 `src/components/ui/` 폴더에 파일이 생성됩니다:

```tsx
// 컴포넌트 import
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 사용 예시
function MyComponent() {
  return (
    <Card>
      <h2>제목</h2>
      <Button>클릭</Button>
    </Card>
  );
}
```

### 3. 컴포넌트 파일 구조

추가된 컴포넌트는 다음과 같은 구조로 생성됩니다:

```
packages/after/src/
  ├── components/
  │   └── ui/           # shadcn/ui 컴포넌트들
  │       ├── button.tsx
  │       ├── card.tsx
  │       └── input.tsx
  └── lib/
      └── utils.ts      # cn() 함수 등 유틸리티
```

---

## 컴포넌트 추가하기

### 자주 사용하는 컴포넌트들

#### 폼 컴포넌트
```bash
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add radio-group
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add form
```

#### 레이아웃 컴포넌트
```bash
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add scroll-area
pnpm dlx shadcn@latest add sheet
pnpm dlx shadcn@latest add tabs
```

#### 오버레이 컴포넌트
```bash
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add alert-dialog
pnpm dlx shadcn@latest add popover
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add dropdown-menu
```

#### 피드백 컴포넌트
```bash
pnpm dlx shadcn@latest add alert
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add progress
pnpm dlx shadcn@latest add skeleton
```

#### 데이터 표시 컴포넌트
```bash
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add avatar
```

### 전체 컴포넌트 목록 확인

shadcn/ui 공식 사이트에서 모든 컴포넌트를 확인할 수 있습니다:
https://ui.shadcn.com/docs/components

---

## 컴포넌트 커스터마이징

### 1. 직접 코드 수정하기

컴포넌트 파일을 직접 열어서 수정할 수 있습니다:

```tsx
// src/components/ui/button.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

// 이 코드를 원하는 대로 수정 가능!
```

### 2. Variants 추가하기

CVA (Class Variance Authority)를 사용하여 새로운 variant를 추가할 수 있습니다:

```tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-primary",
        // 새로운 variant 추가
        custom: "bg-purple-500 hover:bg-purple-600",
      },
    },
  }
);
```

### 3. 테마 색상 변경하기

`globals.css`에서 CSS 변수를 수정하여 전체 테마 색상을 변경할 수 있습니다:

```css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;  /* 이 값 변경 */
    --primary-foreground: 210 40% 98%;
  }
}
```

### 4. Tailwind 클래스로 스타일 오버라이드

`className` prop을 사용하여 스타일을 추가할 수 있습니다:

```tsx
<Button className="w-full bg-red-500 hover:bg-red-600">
  커스텀 스타일 버튼
</Button>
```

---

## 실전 예시

### 예시 1: 간단한 폼 만들기

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 예시 2: 모달 다이얼로그

```tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">삭제</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 항목이 영구적으로 삭제됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline">취소</Button>
          <Button variant="destructive">삭제</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 예시 3: 테이블과 배지 조합

```tsx
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UserTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>역할</TableHead>
          <TableHead>상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.active ? "default" : "destructive"}>
                {user.active ? "활성" : "비활성"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## 자주 묻는 질문

### Q1: 컴포넌트를 추가할 때마다 터미널 명령어를 실행해야 하나요?

**A**: 네, 맞습니다. shadcn/ui는 필요한 컴포넌트를 프로젝트에 복사하는 방식이기 때문에, 사용할 컴포넌트마다 명령어를 실행해야 합니다. 하지만 한 번 추가하면 그 컴포넌트는 프로젝트의 일부가 되어 자유롭게 수정할 수 있습니다.

```bash
# 여러 개를 한 줄에 추가 가능
pnpm dlx shadcn@latest add button card input dialog
```

### Q2: 컴포넌트를 업데이트하려면 어떻게 하나요?

**A**: shadcn/ui CLI로 컴포넌트를 다시 추가하면 됩니다. 기존 파일이 있다면 덮어쓸지 물어봅니다:

```bash
pnpm dlx shadcn@latest add button --overwrite
```

하지만 보통은 직접 수정한 내용이 있으므로, 업데이트가 필요할 때만 선택적으로 업데이트하는 것이 좋습니다.

### Q3: 기존 컴포넌트와 충돌하면 어떻게 하나요?

**A**: 기존에 `src/components/ui/button.tsx`가 있다면, shadcn/ui는 파일이 이미 존재한다고 알려줍니다. `--overwrite` 플래그를 사용하여 덮어쓸 수 있습니다:

```bash
pnpm dlx shadcn@latest add button --overwrite
```

### Q4: Tailwind CSS 없이 사용할 수 있나요?

**A**: 아니요, shadcn/ui는 Tailwind CSS에 의존합니다. 모든 스타일이 Tailwind 클래스로 작성되어 있기 때문에 Tailwind CSS가 필수입니다.

### Q5: 다른 프로젝트로 복사할 수 있나요?

**A**: 네! `src/components/ui/` 폴더의 컴포넌트 파일들을 그대로 다른 프로젝트로 복사하면 됩니다. 단, 다음 조건을 만족해야 합니다:

- Tailwind CSS가 설정되어 있어야 함
- `lib/utils.ts` 파일이 있어야 함 (cn 함수)
- 필요한 의존성이 설치되어 있어야 함 (예: class-variance-authority, clsx, tailwind-merge 등)

### Q6: 번들 크기는 어떻게 되나요?

**A**: 사용하는 컴포넌트만 번들에 포함됩니다. 컴포넌트 코드가 프로젝트에 직접 포함되므로, 사용하지 않는 컴포넌트는 번들에 포함되지 않습니다. 이는 다른 라이브러리들보다 유리한 점입니다.

### Q7: TypeScript 없이 사용할 수 있나요?

**A**: shadcn/ui 컴포넌트는 TypeScript로 작성되어 있지만, JavaScript 프로젝트에서도 사용할 수 있습니다. 단, 타입 정보는 받을 수 없습니다.

---

## 유용한 리소스

- **공식 문서**: https://ui.shadcn.com
- **컴포넌트 목록**: https://ui.shadcn.com/docs/components
- **설치 가이드**: https://ui.shadcn.com/docs/installation
- **GitHub**: https://github.com/shadcn-ui/ui

---

## 현재 프로젝트 설정 요약

### 설치된 컴포넌트
- 없음 (필요시 추가)

### 설정 파일
- `components.json`: `/components.json`
- Tailwind 설정: `/tailwind.config.js`
- CSS 변수: `/packages/after/src/styles/globals.css`
- 유틸리티: `/packages/after/src/lib/utils.ts`

### 컴포넌트 저장 위치
- `/packages/after/src/components/ui/`

### 사용 방법
```bash
# 컴포넌트 추가
pnpm dlx shadcn@latest add [component-name]

# 사용
import { Component } from "@/components/ui/[component-name]"
```

---

**마지막 업데이트**: 2024년

