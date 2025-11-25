# After 패키지 리팩토링 명세서

## 개요

이 문서는 `packages/after/src/components` 폴더의 컴포넌트들을 shadcn/ui 방식으로 리팩토링한 내용을 정리한 명세서입니다.

## 리팩토링 목표

1. **비즈니스 로직 분리**: UI 컴포넌트에서 도메인 로직 제거
2. **shadcn/ui 패턴 적용**: 컴포넌트 조합 패턴 사용
3. **디자인 토큰 통일**: 모든 스타일을 디자인 토큰으로 관리
4. **접근성 개선**: Radix UI 기반 컴포넌트로 접근성 향상
5. **타입 안정성 강화**: TypeScript 타입 정의 개선
6. **하위 호환성 유지**: 기존 API 유지하면서 내부 구현 개선

---

## 1. 추가된 shadcn/ui 컴포넌트

### 1.1 Badge 컴포넌트
**파일**: `packages/after/src/components/ui/badge.tsx`

**특징**:
- CVA를 사용한 variant 시스템
- 디자인 토큰 기반 스타일링
- `primary`, `secondary`, `success`, `danger`, `warning`, `info` variant 지원
- `small`, `medium`, `large` size 지원
- `pill` prop 지원

**사용 예시**:
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="primary" size="medium">Primary</Badge>
<Badge variant="success" pill>Success</Badge>
```

### 1.2 Checkbox 컴포넌트
**파일**: `packages/after/src/components/ui/checkbox.tsx`

**특징**:
- Radix UI 기반으로 접근성 자동 처리
- 디자인 토큰 기반 스타일링
- 체크 상태에 따른 자동 스타일 변경

**사용 예시**:
```tsx
import { Checkbox } from '@/components/ui/checkbox';

<Checkbox checked={checked} onCheckedChange={setChecked} />
```

### 1.3 Textarea 컴포넌트
**파일**: `packages/after/src/components/ui/textarea.tsx`

**특징**:
- 디자인 토큰 기반 스타일링
- 포커스 시 border 두께 변경 애니메이션
- disabled 상태 스타일링

**사용 예시**:
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="내용을 입력하세요" rows={4} />
```

### 1.4 Alert 컴포넌트
**파일**: `packages/after/src/components/ui/alert.tsx`

**특징**:
- CVA를 사용한 variant 시스템
- `default`, `info`, `success`, `warning`, `error` variant 지원
- AlertTitle, AlertDescription, AlertIcon, AlertClose 서브 컴포넌트 제공

**사용 예시**:
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

<Alert variant="success">
  <AlertTitle>성공</AlertTitle>
  <AlertDescription>작업이 완료되었습니다.</AlertDescription>
</Alert>
```

### 1.5 Dialog 컴포넌트
**파일**: `packages/after/src/components/ui/dialog.tsx`

**특징**:
- Radix UI 기반으로 접근성 자동 처리
- 포커스 트랩, ESC 키 처리 자동화
- `small`, `medium`, `large` size 지원
- DialogHeader, DialogFooter, DialogTitle, DialogDescription 서브 컴포넌트 제공

**사용 예시**:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent size="medium">
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
    </DialogHeader>
    내용
  </DialogContent>
</Dialog>
```

---

## 2. 비즈니스 규칙 분리

### 2.1 business-rules.ts
**파일**: `packages/after/src/lib/business-rules.ts`

**목적**: UI 컴포넌트에서 분리된 비즈니스 로직 관리

**주요 함수**:
- `canDeleteUser(user: User): boolean` - 사용자 삭제 가능 여부
- `canEditUser(user: User): boolean` - 사용자 수정 가능 여부
- `canPublishPost(post: Post): boolean` - 게시글 게시 가능 여부
- `canArchivePost(post: Post): boolean` - 게시글 보관 가능 여부
- `canRestorePost(post: Post): boolean` - 게시글 복원 가능 여부
- `getButtonVariantFromAction(action): variant` - 액션에 따른 버튼 variant 결정
- `getButtonLabelFromAction(action, entityType): string` - 액션에 따른 버튼 라벨 생성

**사용 예시**:
```tsx
import { canDeleteUser, getButtonVariantFromAction } from '@/lib/business-rules';

const canDelete = canDeleteUser(user);
const variant = getButtonVariantFromAction('delete'); // 'danger'
```

### 2.2 badge-mappers.ts
**파일**: `packages/after/src/lib/badge-mappers.ts`

**목적**: 도메인 특화 props를 Badge variant로 변환

**주요 함수**:
- `getBadgeVariantFromStatus(status): BadgeVariant` - 상태에 따른 variant
- `getBadgeLabelFromStatus(status): string` - 상태에 따른 라벨
- `getBadgeVariantFromUserRole(userRole): BadgeVariant` - 사용자 역할에 따른 variant
- `getBadgeLabelFromUserRole(userRole): string` - 사용자 역할에 따른 라벨
- `getBadgeVariantFromPriority(priority): BadgeVariant` - 우선순위에 따른 variant
- `getBadgeLabelFromPriority(priority): string` - 우선순위에 따른 라벨
- `getBadgeVariantFromPaymentStatus(paymentStatus): BadgeVariant` - 결제 상태에 따른 variant
- `getBadgeLabelFromPaymentStatus(paymentStatus): string` - 결제 상태에 따른 라벨

**사용 예시**:
```tsx
import { getBadgeVariantFromStatus, getBadgeLabelFromStatus } from '@/lib/badge-mappers';

const variant = getBadgeVariantFromStatus('published'); // 'success'
const label = getBadgeLabelFromStatus('published'); // '게시됨'
```

---

## 3. Atoms 컴포넌트 리팩토링

### 3.1 Button 컴포넌트
**파일**: `packages/after/src/components/atoms/Button.tsx`

**변경 사항**:
- ✅ shadcn/ui Button 사용
- ✅ 비즈니스 로직을 `lib/business-rules.ts`로 분리
- ✅ 하위 호환성을 위해 도메인 props 유지 (권장하지 않음)
- ✅ 기존 API 유지 (`variant`, `size`, `fullWidth` 등)

**Before**:
```tsx
// 비즈니스 로직이 컴포넌트 내부에 있음
<Button entityType="user" action="delete" entity={user}>
  삭제
</Button>
```

**After**:
```tsx
// 비즈니스 로직은 별도 함수로 처리
import { canDeleteUser } from '@/lib/business-rules';

const canDelete = canDeleteUser(user);
<Button variant="danger" disabled={!canDelete} onClick={handleDelete}>
  삭제
</Button>

// 하위 호환성 유지 (권장하지 않음)
<Button entityType="user" action="delete" entity={user} />
```

**주요 개선점**:
- 비즈니스 로직 분리로 테스트 용이성 향상
- UI 컴포넌트의 재사용성 증가
- 도메인 로직 변경 시 한 곳만 수정

### 3.2 Badge 컴포넌트
**파일**: `packages/after/src/components/atoms/Badge.tsx`

**변경 사항**:
- ✅ shadcn/ui Badge 사용
- ✅ 도메인 매핑 로직을 `lib/badge-mappers.ts`로 분리
- ✅ 하위 호환성을 위해 도메인 props 유지 (권장하지 않음)
- ✅ 기존 API 유지 (`type`, `size`, `pill` 등)

**Before**:
```tsx
// 복잡한 조건부 로직이 컴포넌트 내부에 있음
<Badge status="published">게시됨</Badge>
```

**After**:
```tsx
// 도메인 매핑은 별도 함수로 처리
import { getBadgeVariantFromStatus, getBadgeLabelFromStatus } from '@/lib/badge-mappers';

const variant = getBadgeVariantFromStatus('published');
const label = getBadgeLabelFromStatus('published');
<Badge variant={variant}>{label}</Badge>

// 하위 호환성 유지 (권장하지 않음)
<Badge status="published" />
```

**주요 개선점**:
- 조건부 로직 제거로 코드 가독성 향상
- 도메인 매핑 로직 재사용 가능
- 새로운 도메인 타입 추가 시 확장 용이

---

## 4. Molecules 컴포넌트 리팩토링

### 4.1 FormInput 컴포넌트
**파일**: `packages/after/src/components/molecules/FormInput.tsx`

**변경 사항**:
- ✅ shadcn/ui Input과 Label 사용
- ✅ 검증 로직은 하위 호환성을 위해 유지하되 `@deprecated` 표시
- ✅ 접근성 개선 (aria-invalid, aria-describedby)
- ✅ 디자인 토큰 기반 스타일링

**주요 개선점**:
- 접근성 속성 자동 적용
- 일관된 스타일링 (디자인 토큰 사용)
- 검증 로직은 상위 컴포넌트에서 처리 권장

### 4.2 FormCheckbox 컴포넌트
**파일**: `packages/after/src/components/molecules/FormCheckbox.tsx`

**변경 사항**:
- ✅ shadcn/ui Checkbox와 Label 사용
- ✅ Radix UI 기반으로 접근성 자동 처리
- ✅ 디자인 토큰 기반 스타일링

**주요 개선점**:
- 접근성 자동 처리 (키보드 네비게이션, 스크린 리더 지원)
- 일관된 스타일링
- 커스텀 체크박스 대신 표준 컴포넌트 사용

### 4.3 FormSelect 컴포넌트
**파일**: `packages/after/src/components/molecules/FormSelect.tsx`

**변경 사항**:
- ✅ shadcn/ui Select 사용
- ✅ Radix UI 기반으로 접근성 자동 처리
- ✅ 디자인 토큰 기반 스타일링

**주요 개선점**:
- 접근성 자동 처리
- 일관된 스타일링
- 드롭다운 애니메이션 및 포지셔닝 자동 처리

### 4.4 FormTextarea 컴포넌트
**파일**: `packages/after/src/components/molecules/FormTextarea.tsx`

**변경 사항**:
- ✅ shadcn/ui Textarea와 Label 사용
- ✅ 접근성 개선 (aria-invalid, aria-describedby)
- ✅ 디자인 토큰 기반 스타일링

**주요 개선점**:
- 접근성 속성 자동 적용
- 일관된 스타일링
- 포커스 시 border 애니메이션

---

## 5. Organisms 컴포넌트 리팩토링

### 5.1 Alert 컴포넌트
**파일**: `packages/after/src/components/organisms/Alert.tsx`

**변경 사항**:
- ✅ shadcn/ui Alert 사용
- ✅ 디자인 토큰 기반 스타일링
- ✅ 기존 API 유지 (`variant`, `title`, `onClose`, `showIcon`)

**주요 개선점**:
- 일관된 스타일링
- 컴포넌트 조합 패턴 사용

### 5.2 Card 컴포넌트
**파일**: `packages/after/src/components/organisms/Card.tsx`

**변경 사항**:
- ✅ shadcn/ui Card 사용
- ✅ 디자인 토큰 기반 variant 스타일링
- ✅ 기존 API 유지 (`variant`, `title`, `subtitle`, `headerActions`)

**주요 개선점**:
- 컴포넌트 조합 패턴 사용 (CardHeader, CardTitle, CardDescription, CardContent)
- 일관된 스타일링

### 5.3 Modal 컴포넌트
**파일**: `packages/after/src/components/organisms/Modal.tsx`

**변경 사항**:
- ✅ shadcn/ui Dialog 사용
- ✅ Radix UI 기반으로 접근성 자동 처리
- ✅ 포커스 트랩, ESC 키 처리 자동화
- ✅ 기존 API 유지 (`isOpen`, `onClose`, `title`, `size`, `showFooter`)

**주요 개선점**:
- 접근성 자동 처리 (포커스 트랩, ARIA 속성)
- body overflow 자동 관리 불필요 (Radix UI가 처리)
- 애니메이션 자동 처리

**Before**:
```tsx
// 수동으로 body overflow 관리
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
}, [isOpen]);
```

**After**:
```tsx
// Radix UI가 자동으로 처리
<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
  <DialogContent size={size}>
    {children}
  </DialogContent>
</Dialog>
```

### 5.4 Table 컴포넌트
**파일**: `packages/after/src/components/organisms/Table.tsx`

**변경 사항**:
- ✅ shadcn/ui Table 사용
- ✅ 컴포넌트 조합 패턴 사용 (TableHeader, TableBody, TableRow, TableHead, TableCell)
- ✅ shadcn/ui Input을 검색 필드로 사용
- ✅ shadcn/ui Button을 페이지네이션 버튼으로 사용
- ✅ 디자인 토큰 기반 스타일링
- ✅ 하위 호환성을 위해 도메인 props 유지 (권장하지 않음)

**주요 개선점**:
- 컴포넌트 조합 패턴으로 유연성 증가
- 일관된 스타일링
- 접근성 개선 (테이블 구조 명확화)

**Before**:
```tsx
// 단일 컴포넌트로 모든 것을 처리
<table className={tableClasses}>
  <thead>
    <tr>
      {columns.map(column => <th>{column.header}</th>)}
    </tr>
  </thead>
  <tbody>
    {data.map(row => <tr>{/* ... */}</tr>)}
  </tbody>
</table>
```

**After**:
```tsx
// 컴포넌트 조합 패턴
<Table>
  <TableHeader>
    <TableRow>
      {columns.map(column => (
        <TableHead key={column.key}>{column.header}</TableHead>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id}>
        {columns.map(column => (
          <TableCell key={column.key}>{row[column.key]}</TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 5.5 Header 컴포넌트
**파일**: `packages/after/src/components/organisms/Header.tsx`

**변경 사항**:
- ✅ 인라인 스타일을 디자인 토큰 기반 Tailwind 클래스로 전환
- ✅ 디자인 토큰 사용

**주요 개선점**:
- 일관된 스타일링
- 유지보수 용이성 향상

---

## 6. 디자인 토큰 사용

모든 컴포넌트에서 디자인 토큰을 사용하여 스타일을 관리합니다.

### 6.1 컬러 토큰
```css
--color-primary: #1976d2;
--color-primary-hover: #1565c0;
--color-danger: #d32f2f;
--color-success: #388e3c;
/* ... 기타 컬러 토큰 */
```

### 6.2 타이포그래피 토큰
```css
--font-family-primary: Arial, sans-serif;
--font-size-md: 0.875rem;
--font-weight-medium: 500;
/* ... 기타 타이포그래피 토큰 */
```

### 6.3 간격 토큰
```css
--button-padding-sm: 6px 12px;
--button-padding-md: 10px 20px;
--spacing-md: 8px;
/* ... 기타 간격 토큰 */
```

### 6.4 사용 예시
```tsx
// Tailwind 클래스로 사용
<button className="bg-[var(--color-primary)] text-white">
  Button
</button>

// 또는 CSS 변수로 직접 사용
<button style={{ backgroundColor: 'var(--color-primary)' }}>
  Button
</button>
```

---

## 7. 접근성 개선

### 7.1 Radix UI 기반 컴포넌트
다음 컴포넌트들은 Radix UI를 사용하여 접근성이 자동으로 처리됩니다:

- **Checkbox**: 키보드 네비게이션, 스크린 리더 지원
- **Select**: 키보드 네비게이션, 포커스 관리
- **Dialog**: 포커스 트랩, ESC 키 처리, ARIA 속성

### 7.2 ARIA 속성
모든 폼 컴포넌트에 다음 ARIA 속성이 자동으로 적용됩니다:

- `aria-invalid`: 에러 상태 표시
- `aria-describedby`: 에러 메시지 및 도움말 텍스트 연결
- `role="alert"`: 에러 메시지 알림

### 7.3 키보드 네비게이션
- Tab 키로 모든 인터랙티브 요소 접근 가능
- Enter/Space 키로 버튼 클릭 가능
- ESC 키로 모달/다이얼로그 닫기

---

## 8. 파일 구조

```
packages/after/src/
├── components/
│   ├── atoms/
│   │   ├── Button.tsx          # shadcn/ui Button 사용
│   │   ├── Badge.tsx           # shadcn/ui Badge 사용
│   │   └── index.ts
│   ├── molecules/
│   │   ├── FormInput.tsx       # shadcn/ui Input + Label
│   │   ├── FormCheckbox.tsx    # shadcn/ui Checkbox + Label
│   │   ├── FormSelect.tsx      # shadcn/ui Select
│   │   ├── FormTextarea.tsx    # shadcn/ui Textarea + Label
│   │   └── index.ts
│   ├── organisms/
│   │   ├── Alert.tsx           # shadcn/ui Alert
│   │   ├── Card.tsx            # shadcn/ui Card
│   │   ├── Modal.tsx           # shadcn/ui Dialog
│   │   ├── Table.tsx           # shadcn/ui Table
│   │   ├── Header.tsx          # 디자인 토큰 사용
│   │   └── index.ts
│   └── ui/
│       ├── alert.tsx           # shadcn/ui Alert 기본 컴포넌트
│       ├── badge.tsx           # shadcn/ui Badge 기본 컴포넌트
│       ├── button.tsx         # shadcn/ui Button 기본 컴포넌트
│       ├── card.tsx            # shadcn/ui Card 기본 컴포넌트
│       ├── checkbox.tsx        # shadcn/ui Checkbox 기본 컴포넌트
│       ├── dialog.tsx          # shadcn/ui Dialog 기본 컴포넌트
│       ├── form.tsx            # shadcn/ui Form 기본 컴포넌트
│       ├── input.tsx           # shadcn/ui Input 기본 컴포넌트
│       ├── label.tsx           # shadcn/ui Label 기본 컴포넌트
│       ├── select.tsx          # shadcn/ui Select 기본 컴포넌트
│       ├── table.tsx           # shadcn/ui Table 기본 컴포넌트
│       └── textarea.tsx       # shadcn/ui Textarea 기본 컴포넌트
├── lib/
│   ├── business-rules.ts       # 비즈니스 규칙 유틸리티
│   ├── badge-mappers.ts        # Badge 도메인 매핑 유틸리티
│   └── utils.ts                # cn() 유틸리티 함수
└── styles/
    ├── design-tokens.css       # 디자인 토큰 정의
    └── globals.css             # 전역 스타일
```

---

## 9. 마이그레이션 가이드

### 9.1 Button 컴포넌트 마이그레이션

**기존 코드**:
```tsx
<Button
  entityType="user"
  action="delete"
  entity={user}
>
  삭제
</Button>
```

**권장 코드**:
```tsx
import { canDeleteUser } from '@/lib/business-rules';

const canDelete = canDeleteUser(user);
<Button
  variant="danger"
  disabled={!canDelete}
  onClick={handleDelete}
>
  삭제
</Button>
```

### 9.2 Badge 컴포넌트 마이그레이션

**기존 코드**:
```tsx
<Badge status="published" />
```

**권장 코드**:
```tsx
import { getBadgeVariantFromStatus, getBadgeLabelFromStatus } from '@/lib/badge-mappers';

const variant = getBadgeVariantFromStatus('published');
const label = getBadgeLabelFromStatus('published');
<Badge variant={variant}>{label}</Badge>
```

### 9.3 FormInput 컴포넌트 마이그레이션

**기존 코드**:
```tsx
<FormInput
  fieldType="username"
  entityType="user"
  checkBusinessRules={true}
  value={username}
  onChange={setUsername}
/>
```

**권장 코드**:
```tsx
// react-hook-form과 zod 사용
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string()
    .min(3, '사용자명은 3자 이상이어야 합니다')
    .max(20, '사용자명은 20자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9_]+$/, '영문, 숫자, 언더스코어만 사용 가능합니다')
    .refine(val => !['admin', 'root'].includes(val.toLowerCase()), '예약된 사용자명입니다')
});

const { register, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

<FormInput
  {...register('username')}
  error={errors.username?.message}
/>
```

### 9.4 Table 컴포넌트 마이그레이션

**기존 코드**:
```tsx
<Table
  entityType="user"
  onEdit={handleEdit}
  onDelete={handleDelete}
  data={users}
/>
```

**권장 코드**:
```tsx
// 컴포넌트 조합 패턴 사용
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/atoms/Button';

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
            <Button size="sm" variant="primary" onClick={() => handleEdit(user)}>
              수정
            </Button>
            <Button
              size="sm"
              variant="danger"
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

## 10. 주요 개선 사항 요약

### 10.1 코드 품질
- ✅ 비즈니스 로직 분리로 테스트 용이성 향상
- ✅ 도메인 로직 재사용 가능
- ✅ 컴포넌트 단순화로 가독성 향상

### 10.2 유지보수성
- ✅ 디자인 토큰 사용으로 스타일 일관성 유지
- ✅ 비즈니스 규칙 중앙 관리
- ✅ 컴포넌트 조합 패턴으로 유연성 증가

### 10.3 접근성
- ✅ Radix UI 기반 컴포넌트로 접근성 자동 처리
- ✅ ARIA 속성 자동 적용
- ✅ 키보드 네비게이션 지원

### 10.4 타입 안정성
- ✅ TypeScript 타입 정의 강화
- ✅ 제네릭 타입 활용
- ✅ 타입 가드 함수 제공

### 10.5 개발자 경험
- ✅ 일관된 API 설계
- ✅ 명확한 컴포넌트 구조
- ✅ 하위 호환성 유지

---

## 11. 다음 단계 (권장사항)

### 11.1 검증 로직 분리
FormInput의 검증 로직을 완전히 제거하고 react-hook-form과 zod를 사용하는 것을 권장합니다.

### 11.2 도메인 props 제거
하위 호환성을 위해 유지된 도메인 props(`entityType`, `action`, `entity` 등)를 점진적으로 제거하는 것을 권장합니다.

### 11.3 테스트 작성
비즈니스 규칙 함수들에 대한 단위 테스트를 작성하는 것을 권장합니다.

### 11.4 Storybook 스토리 업데이트
리팩토링된 컴포넌트들에 대한 Storybook 스토리를 업데이트하는 것을 권장합니다.

---

## 12. 참고 자료

- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Radix UI 문서](https://www.radix-ui.com)
- [React Hook Form 문서](https://react-hook-form.com)
- [Zod 문서](https://zod.dev)
- [디자인 토큰 명세서](./디자인 토큰 명세서.md)
- [Before 해결방안 명세서](./before해결방안.md)

---

**작성일**: 2024년  
**대상**: `packages/after/src/components` 리팩토링  
**목표**: shadcn/ui 원칙에 따른 현대적인 컴포넌트 시스템 구축

