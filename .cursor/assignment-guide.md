# Chapter3-1 과제 수행 가이드

## 📋 목차
1. [과제 개요](#과제-개요)
2. [과제 목표](#과제-목표)
3. [단계별 수행 방법](#단계별-수행-방법)
4. [Before 패키지 분석](#before-패키지-분석)
5. [After 패키지 개편](#after-패키지-개편)
6. [구현 체크리스트](#구현-체크리스트)
7. [자주 묻는 질문](#자주-묻는-질문)

---

## 과제 개요

### 프로젝트 구조
```
front_7th_chapter3-1/
├── packages/
│   ├── before/          # 레거시 시스템 (분석 대상)
│   │   └── src/
│   │       ├── components/     # 레거시 컴포넌트들
│   │       │   ├── atoms/
│   │       │   ├── molecules/
│   │       │   └── organisms/
│   │       └── pages/
│   │           └── ManagementPage.tsx
│   │
│   └── after/           # 현대적 디자인 시스템 (구현 목표)
│       └── src/
│           ├── components/
│           │   └── ui/         # shadcn/ui 컴포넌트들
│           ├── lib/
│           ├── styles/
│           └── pages/
│               └── ManagementPage.tsx (마이그레이션 대상)
└── components.json      # shadcn/ui 설정
```

### 과제의 핵심
**레거시 코드베이스를 현대적인 디자인 시스템으로 개편하는 실무 경험**

1. **분석**: before 패키지의 문제점 파악
2. **설계**: 현대적인 디자인 시스템 설계
3. **구현**: TailwindCSS, shadcn/ui, CVA 활용하여 개편
4. **마이그레이션**: ManagementPage를 새 시스템으로 이전

---

## 과제 목표

### 1. 레거시 시스템의 문제점 이해

#### 주요 문제점들:
- ❌ 일관성 없는 컴포넌트 API
- ❌ 혼재된 스타일링 방식 (인라인, CSS 클래스, 하드코딩)
- ❌ 타입 안전성 부족
- ❌ 접근성 이슈
- ❌ UI 컴포넌트에 도메인 로직 혼재

### 2. 현대적인 도구들의 필요성 체감

- ✅ TailwindCSS: 유틸리티 우선 접근법
- ✅ CVA: 선언적 variants 패턴
- ✅ shadcn/ui: 접근성 내장 컴포넌트
- ✅ Storybook: 컴포넌트 문서화

### 3. 올바른 컴포넌트 설계 원칙 습득

- ✅ UI와 비즈니스 로직 분리
- ✅ 일관된 컴포넌트 API
- ✅ 타입 안전성 확보
- ✅ 재사용 가능한 컴포넌트 구조

---

## 단계별 수행 방법

### 🎯 Phase 1: Before 패키지 분석 (필수)

#### 1.1 Before 패키지 실행 및 탐색

```bash
# Before 패키지 실행
pnpm dev:before

# 브라우저에서 확인
# http://localhost:5173
```

**확인해야 할 사항:**
- [ ] ManagementPage가 어떻게 구성되어 있는지
- [ ] 어떤 컴포넌트들이 사용되는지
- [ ] UI/UX의 전반적인 흐름 파악

#### 1.2 코드 분석

**분석 대상:**
- `packages/before/src/components/atoms/` - Button, Badge
- `packages/before/src/components/molecules/` - FormInput, FormSelect 등
- `packages/before/src/components/organisms/` - Table, Card, Modal 등
- `packages/before/src/pages/ManagementPage.tsx` - 메인 페이지

**분석 포인트:**

1. **일관성 없는 API 발견**
   ```typescript
   // 예시: 각 컴포넌트마다 다른 prop 이름
   <FormInput helpText="도움말" />          // helpText
   <FormSelect help="도움말" />             // help
   <FormTextarea description="설명" />      // description
   ```

2. **도메인 로직 혼재**
   ```typescript
   // Button.tsx 안에 비즈니스 규칙이 있음
   if (entityType === 'user' && action === 'delete' && entity.role === 'admin') {
     actualDisabled = true;
   }
   ```

3. **혼재된 스타일링**
   ```typescript
   // 인라인 스타일
   style={{ padding: '10px' }}
   
   // CSS 클래스
   className="btn btn-primary"
   
   // 하드코딩된 색상
   backgroundColor: '#007bff'
   ```

4. **타입 안전성 부족**
   ```typescript
   entity?: any;  // any 타입 사용
   data?: any[];  // 느슨한 타입 정의
   ```

#### 1.3 문제점 정리

다음과 같은 형식으로 문제점을 정리하세요:

```markdown
### 발견된 문제점

1. **일관성 없는 API**
   - 위치: FormInput.tsx, FormSelect.tsx
   - 문제: 같은 기능인데 prop 이름이 다름 (helpText vs help)
   - 영향: 개발자가 혼란스러움, 타입 추론 어려움

2. **도메인 로직 혼재**
   - 위치: Button.tsx, Table.tsx
   - 문제: UI 컴포넌트가 비즈니스 규칙을 알고 있음
   - 영향: 재사용 불가능, 테스트 어려움

3. **스타일링 혼재**
   - 위치: 전체 컴포넌트
   - 문제: 인라인 스타일, CSS 클래스, 하드코딩된 값 혼재
   - 영향: 유지보수 어려움, 일관성 부족
```

---

### 🎯 Phase 2: After 패키지 환경 설정 (필수)

#### 2.1 현재 상태 확인

**이미 설정되어 있는 것들:**
- ✅ Tailwind CSS 설치 및 설정
- ✅ shadcn/ui 초기화 완료
- ✅ `lib/utils.ts` 준비됨
- ✅ `globals.css` 설정됨

**확인 명령어:**
```bash
# Tailwind 설정 확인
cat tailwind.config.js

# shadcn/ui 설정 확인
cat components.json

# 필요한 패키지 확인
cat package.json | grep -A 10 "devDependencies"
```

#### 2.2 필요한 shadcn/ui 컴포넌트 추가

ManagementPage에서 사용할 컴포넌트들을 추가합니다:

```bash
# 필수 컴포넌트들
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add alert

# 또는 한 번에 추가
pnpm dlx shadcn@latest add button input select textarea checkbox card table dialog badge label alert
```

**컴포넌트 위치:**
추가된 컴포넌트는 `packages/after/src/components/ui/` 폴더에 생성됩니다.

#### 2.3 컴포넌트 확인

```bash
# 추가된 컴포넌트 확인
ls packages/after/src/components/ui/
```

---

### 🎯 Phase 3: 컴포넌트 개편 전략 (필수)

#### 3.1 Atomic Design vs 실무 구조 이해

**이론 (Atomic Design):**
```
atoms/ → molecules/ → organisms/ → templates/ → pages/
```

**실무 (shadcn/ui 스타일):**
```
components/ui/  # 모든 UI 컴포넌트를 한 곳에
```

**이번 과제에서의 접근:**
- ✅ Atomic Design의 **개념**은 이해 (재사용, 조합)
- ✅ 하지만 **폴더 구조**는 실무 스타일로 (`components/ui/`)
- ✅ shadcn/ui 컴포넌트들은 모두 `components/ui/`에 배치

#### 3.2 UI와 비즈니스 로직 분리 전략

**Before (문제):**
```typescript
// Button.tsx - 도메인 로직이 UI 컴포넌트에 있음
<Button 
  entityType="user" 
  action="delete" 
  entity={user}
/>
```

**After (해결책):**
```typescript
// UI 컴포넌트는 순수하게 UI만
<Button variant="destructive" onClick={handleDelete}>
  삭제
</Button>

// 비즈니스 로직은 상위 컴포넌트나 Hook에서 처리
const handleDelete = () => {
  if (user.role === 'admin') {
    // 관리자는 삭제 불가 로직
    return;
  }
  // 삭제 로직
};
```

#### 3.3 일관된 API 설계 원칙

**원칙:**
1. **Prop 이름 통일**: 같은 기능은 같은 이름 사용
   - ✅ `error`, `helpText`, `label` (일관성)
   - ❌ `error`, `help`, `description` (불일치)

2. **타입 안전성**: `any` 타입 제거
   ```typescript
   // Before
   entity?: any;
   
   // After
   entity?: User | Post;
   ```

3. **Variant 패턴**: CVA 사용
   ```typescript
   const buttonVariants = cva(
     "base-classes",
     {
       variants: {
         variant: { primary: "...", secondary: "..." },
         size: { sm: "...", md: "...", lg: "..." },
       },
     }
   );
   ```

---

### 🎯 Phase 4: ManagementPage 마이그레이션 (필수)

#### 4.1 Before ManagementPage 분석

**확인 사항:**
- [ ] 어떤 컴포넌트들이 사용되는가?
- [ ] 어떤 기능들이 있는가?
- [ ] 비즈니스 로직은 어디에 있는가?

#### 4.2 단계별 마이그레이션

**Step 1: 레이아웃 구조 확인**
```typescript
// Before의 구조 파악
// - Header
// - Card (게시글 목록)
// - Table (데이터 표시)
// - Modal (상세보기/수정)
// - Form (생성/수정)
```

**Step 2: 컴포넌트 하나씩 교체**

예시: Button 교체
```typescript
// Before
import { Button } from '../components/atoms/Button';
<Button 
  entityType="post" 
  action="delete" 
  entity={post}
/>

// After
import { Button } from '@/components/ui/button';
<Button 
  variant="destructive" 
  onClick={() => handleDelete(post.id)}
>
  삭제
</Button>
```

**Step 3: 비즈니스 로직 분리**

```typescript
// Custom Hook으로 비즈니스 로직 분리
// hooks/usePostManagement.ts
export function usePostManagement() {
  const [posts, setPosts] = useState([]);
  
  const handleDelete = (id: number) => {
    // 삭제 로직
  };
  
  const handlePublish = (id: number) => {
    // 게시 로직
  };
  
  return { posts, handleDelete, handlePublish };
}

// ManagementPage.tsx
const { posts, handleDelete, handlePublish } = usePostManagement();
```

**Step 4: 스타일링 전환**

```typescript
// Before
<div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>

// After
<div className="p-4 bg-slate-100">
```

#### 4.3 마이그레이션 체크리스트

- [ ] Header → shadcn/ui 컴포넌트로 교체
- [ ] Card → shadcn/ui Card 컴포넌트 사용
- [ ] Table → shadcn/ui Table 컴포넌트 사용
- [ ] Form Input → shadcn/ui Input, Select, Textarea 사용
- [ ] Button → shadcn/ui Button 사용
- [ ] Modal/Dialog → shadcn/ui Dialog 사용
- [ ] Badge → shadcn/ui Badge 사용
- [ ] 비즈니스 로직을 Hook으로 분리
- [ ] 인라인 스타일 → Tailwind 클래스로 전환
- [ ] 타입 안전성 확보 (any 제거)

---

### 🎯 Phase 5: Storybook 설정 및 Stories 작성 (필수)

#### 5.1 Storybook 설치

```bash
cd packages/after

# Storybook 초기화
pnpm dlx storybook@latest init

# 또는 수동 설치
pnpm add -D @storybook/react @storybook/react-vite
pnpm add -D storybook
```

**설정 파일:**
- `.storybook/main.ts` - Storybook 설정
- `.storybook/preview.ts` - 글로벌 설정

#### 5.2 Story 작성 예시

**Button.stories.tsx:**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

#### 5.3 Storybook 실행

```bash
# Storybook 실행
pnpm storybook

# 또는 루트에서
pnpm storybook
```

**작성해야 할 Stories:**
- [ ] Button
- [ ] Input
- [ ] Card
- [ ] Table
- [ ] Dialog
- [ ] Badge
- [ ] Select

---

### 🎯 Phase 6: 문서화 및 회고 (필수)

#### 6.1 README 업데이트

**Before/After 비교 문서 작성:**

```markdown
## Before vs After 비교

### 1. 컴포넌트 API 개선

**Before:**
```typescript
<FormInput helpText="도움말" />
<FormSelect help="도움말" />
```

**After:**
```typescript
<Input helperText="도움말" />
<Select helperText="도움말" />
```

### 2. 스타일링 개선

**Before:**
```typescript
<div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
```

**After:**
```typescript
<div className="p-4 bg-slate-100">
```

### 3. 타입 안전성 개선

**Before:**
```typescript
entity?: any;
```

**After:**
```typescript
entity: User | Post;
```
```

#### 6.2 회고 작성

PR 템플릿에 따라 회고를 작성하세요:

```markdown
### Before 패키지에서 발견한 문제점

1. **일관성 없는 API**
   - 각 컴포넌트마다 다른 prop 이름 사용
   - 개발자가 혼란스러움

2. **도메인 로직 혼재**
   - UI 컴포넌트가 비즈니스 규칙을 알고 있음
   - 재사용 불가능

### 개편 과정에서 집중한 부분

1. **UI와 로직 분리**
   - 비즈니스 로직을 Custom Hook으로 분리
   - UI 컴포넌트는 순수하게 presentation만 담당

2. **일관된 API 설계**
   - shadcn/ui 스타일을 따름
   - 모든 컴포넌트가 일관된 prop 이름 사용

### 사용한 기술 스택 경험

- TailwindCSS: 빠른 스타일링, 일관성 확보
- shadcn/ui: 접근성 내장, 커스터마이징 용이
- CVA: 타입 안전한 variants 패턴
```

---

## 구현 체크리스트

### ✅ 필수 구현 사항

#### 디자인 시스템
- [ ] TailwindCSS 설정 확인 및 필요시 보완
- [ ] shadcn/ui 컴포넌트 추가 (Button, Input, Select, Card, Table, Dialog, Badge 등)
- [ ] 디자인 토큰 정의 (globals.css의 CSS 변수)
- [ ] CVA 패턴 적용 확인

#### 컴포넌트 개편
- [ ] UI 컴포넌트에서 도메인 로직 제거
- [ ] 비즈니스 로직을 Custom Hook으로 분리
- [ ] 일관된 컴포넌트 API 설계
- [ ] 타입 안전성 확보 (any 타입 제거)

#### 페이지 마이그레이션
- [ ] ManagementPage.tsx를 새 디자인 시스템으로 마이그레이션
- [ ] 모든 레거시 컴포넌트를 shadcn/ui 컴포넌트로 교체
- [ ] 인라인 스타일을 Tailwind 클래스로 전환
- [ ] 기능 동작 확인

#### Storybook
- [ ] Storybook 설정 및 실행 확인
- [ ] 주요 컴포넌트 Stories 작성 (최소 3개 이상)
- [ ] Args와 Controls 설정

#### 문서화
- [ ] README에 Before/After 비교 문서 추가
- [ ] 개선 사항 문서화
- [ ] PR 템플릿에 회고 작성

### ⭐ 심화 구현 사항

- [ ] Dark Mode 완전 지원
- [ ] Dark Mode Toggle 버튼 구현
- [ ] 디자인 토큰 시스템 고도화 (색상 팔레트, 타이포그래피)
- [ ] React Hook Form + Zod로 Form 검증 구현

---

## 단계별 작업 순서 요약

### 1주차: 분석 및 환경 설정
1. Before 패키지 실행 및 코드 분석
2. 문제점 정리 및 문서화
3. After 패키지 환경 확인
4. 필요한 shadcn/ui 컴포넌트 추가

### 2주차: 컴포넌트 개편 및 마이그레이션
1. ManagementPage 구조 분석
2. 컴포넌트 하나씩 교체
3. 비즈니스 로직 분리 (Custom Hooks)
4. 스타일링 전환 (Tailwind CSS)
5. 타입 안전성 개선

### 3주차: Storybook 및 문서화
1. Storybook 설정
2. Stories 작성
3. README 업데이트
4. 회고 작성

---

## 자주 묻는 질문

### Q1: Before 패키지의 컴포넌트를 수정해도 되나요?

**A**: 아니요, Before 패키지는 **분석 대상**입니다. 수정하지 말고 분석만 하세요. 모든 개편 작업은 **After 패키지**에서 진행합니다.

### Q2: 모든 레거시 컴포넌트를 shadcn/ui로 교체해야 하나요?

**A**: ManagementPage에서 사용되는 컴포넌트들을 우선적으로 교체하세요. 필수적으로 필요한 컴포넌트는:
- Button
- Input, Select, Textarea
- Card
- Table
- Dialog/Modal
- Badge

### Q3: Atomic Design 폴더 구조(atoms/molecules/organisms)를 유지해야 하나요?

**A**: 아니요. 이번 과제에서는 **shadcn/ui 스타일**을 따라 `components/ui/` 폴더에 모든 UI 컴포넌트를 배치합니다. Atomic Design의 **개념**(재사용, 조합)은 이해하되, **폴더 구조**는 실무 스타일을 따릅니다.

### Q4: 비즈니스 로직을 어디에 분리하나요?

**A**: `src/hooks/` 폴더를 만들어서 Custom Hook으로 분리하세요:

```
packages/after/src/
  ├── hooks/
  │   ├── usePostManagement.ts
  │   └── useUserManagement.ts
  └── pages/
      └── ManagementPage.tsx
```

### Q5: Storybook은 필수인가요?

**A**: 네, 필수입니다. 최소 3개 이상의 컴포넌트에 대한 Stories를 작성해야 합니다.

### Q6: Dark Mode는 어떻게 구현하나요?

**A**: 심화 과제입니다. Tailwind CSS의 dark mode와 CSS 변수를 활용합니다:

```css
/* globals.css */
.dark {
  --background: ...;
  --foreground: ...;
}
```

```tsx
// Dark Mode Toggle
import { useTheme } from "next-themes"; // 또는 직접 구현
```

### Q7: shadcn/ui 컴포넌트를 커스터마이징해도 되나요?

**A**: 네, 완전히 가능합니다! 컴포넌트 코드가 프로젝트에 직접 복사되므로 원하는 대로 수정할 수 있습니다. 단, 너무 많이 수정하면 나중에 업데이트하기 어려울 수 있습니다.

### Q8: 타입 정의는 어디에 하나요?

**A**: 컴포넌트와 함께 정의하거나, `src/types/` 폴더를 만들어서 공통 타입을 정의할 수 있습니다:

```
packages/after/src/
  ├── types/
  │   ├── post.ts
  │   └── user.ts
  └── components/
```

---

## 유용한 명령어 모음

```bash
# Before 패키지 실행
pnpm dev:before

# After 패키지 실행
pnpm dev:after

# shadcn/ui 컴포넌트 추가
pnpm dlx shadcn@latest add [component-name]

# Storybook 실행
pnpm storybook

# 빌드 테스트
pnpm build:after

# 린트 확인
pnpm lint
```

---

## 참고 자료

### 공식 문서
- [TailwindCSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [CVA 문서](https://cva.style/docs)
- [Storybook 문서](https://storybook.js.org/docs/react/get-started/introduction)

### 관련 가이드
- `.cursor/shadcn-ui-guide.md` - shadcn/ui 사용 가이드
- `README.md` - 프로젝트 전체 설명
- `.github/pull_request_template.md` - PR 템플릿

---

**마지막 업데이트**: 2024년

**과제 기간**: 3주 권장

**문의**: 과제 관련 질문은 PR이나 이슈로 남겨주세요.

