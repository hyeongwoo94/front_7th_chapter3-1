# Before 패키지 문제점 명세서

## 개요

이 문서는 `packages/before` 폴더의 코드를 분석하여 발견된 문제점들을 shadcn/ui 가이드의 원칙과 비교하여 정리한 명세서입니다.

## 분석 기준

이 명세서는 다음 기준을 참고하여 작성되었습니다:

-   **shadcn/ui 가이드**: `.cursor/shadcn-ui-guide.md`
-   **현대적인 React 컴포넌트 설계 원칙**
-   **관심사 분리 (Separation of Concerns)**
-   **재사용 가능한 컴포넌트 설계**

---

## 주요 문제점 카테고리

### 1. 관심사 분리 위반 (Separation of Concerns Violation)

#### 1.1 UI 컴포넌트에 도메인 로직 포함

**문제 위치**: `packages/before/src/components/atoms/Button.tsx`

**문제 코드**:

```tsx
interface ButtonProps {
    // 🚨 도메인 관심사 추가
    entityType?: "user" | "post";
    action?: "create" | "edit" | "delete" | "publish" | "archive";
    entity?: any; // 엔티티 객체를 직접 받음
}

// 🚨 Bad Practice: UI 컴포넌트가 비즈니스 규칙을 판단함
if (entityType === "user" && action === "delete" && entity.role === "admin") {
    actualDisabled = true;
}
```

**문제점**:

-   UI 컴포넌트가 비즈니스 도메인(`user`, `post`)을 알고 있음
-   비즈니스 규칙(관리자 삭제 불가, 게시 상태 체크 등)이 UI 컴포넌트에 하드코딩됨
-   컴포넌트 재사용성이 극도로 떨어짐
-   다른 도메인에서 사용 불가능

**shadcn/ui 원칙 위반**:

-   shadcn/ui는 순수한 UI 컴포넌트로, 도메인 로직을 포함하지 않음
-   컴포넌트는 프레젠테이션 로직만 담당해야 함

**해결 방향**:

-   UI 컴포넌트는 `variant`, `size`, `disabled` 같은 순수 UI props만 받아야 함
-   비즈니스 규칙은 상위 컴포넌트나 커스텀 훅에서 처리
-   도메인 특화 로직은 별도의 래퍼 컴포넌트로 분리

---

#### 1.2 UI 컴포넌트에 비즈니스 규칙 검증 포함

**문제 위치**: `packages/before/src/components/molecules/FormInput.tsx`

**문제 코드**:

```tsx
// 🚨 Bad Practice: UI 컴포넌트가 비즈니스 규칙을 검증함
const validateField = (val: string) => {
    // 도메인 특화 검증: 예약어 체크
    if (checkBusinessRules) {
        const reservedWords = ["admin", "root", "system", "administrator"];
        if (reservedWords.includes(val.toLowerCase())) {
            setInternalError("예약된 사용자명입니다");
        }
    }

    // 🚨 비즈니스 규칙: User 엔티티의 이메일은 회사 도메인만
    if (checkBusinessRules && entityType === "user") {
        if (!val.endsWith("@company.com") && !val.endsWith("@example.com")) {
            setInternalError("회사 이메일만 사용 가능합니다");
        }
    }
};
```

**문제점**:

-   폼 입력 컴포넌트가 도메인 특화 검증 로직을 포함
-   예약어, 금칙어, 도메인 제한 등이 UI 컴포넌트에 하드코딩됨
-   검증 로직 변경 시 컴포넌트 수정 필요
-   다른 프로젝트에서 재사용 불가능

**shadcn/ui 원칙 위반**:

-   shadcn/ui의 Input 컴포넌트는 순수한 UI 컴포넌트
-   검증은 react-hook-form + zod 같은 별도 라이브러리로 처리
-   컴포넌트는 UI 렌더링과 기본 HTML 속성만 담당

**해결 방향**:

-   Input 컴포넌트는 `error`, `helperText` 같은 UI props만 받음
-   검증 로직은 react-hook-form의 resolver로 분리
-   비즈니스 규칙은 별도의 validation 함수로 분리

---

### 2. 타입 안정성 부족 (Type Safety Issues)

#### 2.1 `any` 타입 남용

**문제 위치**: 여러 컴포넌트

**문제 코드**:

```tsx
// Button.tsx
entity?: any; // 엔티티 객체를 직접 받음

// Table.tsx
data?: any[];
onRowClick?: (row: any) => void;
onEdit?: (item: any) => void;
```

**문제점**:

-   TypeScript의 타입 안정성 장점을 포기
-   컴파일 타임 오류 감지 불가
-   IDE 자동완성 및 타입 체크 불가
-   런타임 오류 가능성 증가

**shadcn/ui 원칙**:

-   모든 컴포넌트가 완벽한 TypeScript 타입 지원
-   제네릭을 활용한 타입 안정성
-   Props 타입이 명확히 정의됨

**해결 방향**:

-   제네릭 타입 사용: `Table<T>`, `Button<T>`
-   명확한 인터페이스 정의
-   타입 가드 활용

---

### 3. 스타일 시스템 문제 (Styling System Issues)

#### 3.1 하드코딩된 인라인 스타일

**문제 위치**: `packages/before/src/components/organisms/Header.tsx`

**문제 코드**:

```tsx
<header style={{
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}}>
```

**문제점**:

-   스타일 값이 컴포넌트 코드에 하드코딩됨
-   디자인 토큰 시스템 부재
-   일관성 유지 어려움
-   테마 변경 불가능
-   반응형 디자인 적용 어려움

**shadcn/ui 원칙**:

-   모든 스타일이 Tailwind CSS 클래스로 작성
-   CSS 변수를 통한 테마 시스템
-   디자인 토큰 기반 스타일링
-   인라인 스타일 최소화

**해결 방향**:

-   Tailwind CSS 클래스 사용
-   디자인 토큰 시스템 구축
-   CSS 변수 활용

---

#### 3.2 CSS 클래스 하드코딩

**문제 위치**: 모든 컴포넌트

**문제 코드**:

```tsx
const classes = [
    "btn",
    `btn-${actualVariant}`,
    `btn-${size}`,
    fullWidth && "btn-fullwidth",
]
    .filter(Boolean)
    .join(" ");
```

**문제점**:

-   문자열 연결로 클래스 생성 (오타 위험)
-   클래스 이름이 하드코딩됨
-   조건부 클래스 로직이 복잡함
-   타입 안정성 부족

**shadcn/ui 원칙**:

-   `cn()` 유틸리티 함수 사용 (clsx + tailwind-merge)
-   CVA (Class Variance Authority)로 variant 관리
-   타입 안전한 클래스 조합

**해결 방향**:

```tsx
// shadcn/ui 방식
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("inline-flex items-center justify-center", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground",
            destructive: "bg-destructive text-destructive-foreground",
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
        },
    },
});
```

---

### 4. 접근성 부족 (Accessibility Issues)

#### 4.1 ARIA 속성 부재

**문제 위치**: 모든 컴포넌트

**문제 코드**:

```tsx
<button className="modal-close" onClick={onClose}>
    ×
</button>
```

**문제점**:

-   `aria-label` 없음
-   스크린 리더 사용자에게 버튼 목적 불명확
-   키보드 네비게이션 고려 부족
-   포커스 관리 부재

**shadcn/ui 원칙**:

-   Radix UI 기반으로 접근성 자동 고려
-   ARIA 속성 자동 적용
-   키보드 네비게이션 지원
-   포커스 트랩 및 관리

**해결 방향**:

```tsx
<button className="modal-close" onClick={onClose} aria-label="닫기">
    ×
</button>
```

---

#### 4.2 모달 접근성 문제

**문제 위치**: `packages/before/src/components/organisms/Modal.tsx`

**문제 코드**:

```tsx
<div className="modal-overlay" onClick={onClose}>
  <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
```

**문제점**:

-   포커스 트랩 없음 (Tab 키로 모달 밖으로 이동 가능)
-   ESC 키로 닫기 기능 없음
-   모달 열릴 때 첫 번째 포커스 요소로 이동하지 않음
-   스크린 리더에게 모달임을 알리지 않음

**shadcn/ui 원칙**:

-   Radix UI Dialog 사용
-   자동 포커스 관리
-   ESC 키 및 외부 클릭 처리
-   `role="dialog"`, `aria-modal` 자동 적용

---

### 5. 컴포넌트 구조 문제 (Component Structure Issues)

#### 5.1 과도한 조건부 로직

**문제 위치**: `packages/before/src/components/atoms/Badge.tsx`

**문제 코드**:

```tsx
let actualType = type;
let actualContent = children;

if (status) {
    switch (status) {
        case "published":
            actualType = "success";
            break;
        // ... 많은 switch 문
    }
}

if (userRole) {
    switch (
        userRole
        // ... 또 다른 switch 문
    ) {
    }
}

if (priority) {
    // ... 또 다른 switch 문
}

if (paymentStatus) {
    // ... 또 다른 switch 문
}
```

**문제점**:

-   하나의 컴포넌트가 너무 많은 책임을 가짐
-   조건부 로직이 복잡하고 중첩됨
-   유지보수 어려움
-   테스트 복잡도 증가

**shadcn/ui 원칙**:

-   단순하고 명확한 컴포넌트 구조
-   Variant는 CVA로 타입 안전하게 관리
-   복잡한 로직은 별도 함수나 훅으로 분리

**해결 방향**:

-   Badge는 `variant` prop만 받음
-   도메인 특화 매핑은 상위 컴포넌트에서 처리
-   또는 별도의 유틸리티 함수로 분리

---

#### 5.2 컴포넌트 책임 과다

**문제 위치**: `packages/before/src/components/organisms/Table.tsx`

**문제 코드**:

```tsx
interface TableProps {
    // 기본 테이블 기능
    columns?: Column[];
    data?: any[];

    // 🚨 도메인 관심사 추가
    entityType?: "user" | "post";
    onEdit?: (item: any) => void;
    onDelete?: (id: number) => void;
    onPublish?: (id: number) => void;
    onArchive?: (id: number) => void;
    onRestore?: (id: number) => void;
}
```

**문제점**:

-   테이블 컴포넌트가 CRUD 작업까지 담당
-   도메인 특화 액션들이 컴포넌트에 하드코딩됨
-   다른 도메인에서 재사용 불가능

**shadcn/ui 원칙**:

-   Table 컴포넌트는 데이터 표시만 담당
-   액션 버튼은 별도 컴포넌트로 구성
-   컴포넌트 조합(Composition) 방식 사용

---

### 6. 상태 관리 문제 (State Management Issues)

#### 6.1 컴포넌트 내부 상태 과다

**문제 위치**: `packages/before/src/components/organisms/Table.tsx`

**문제 코드**:

```tsx
const [tableData, setTableData] = useState<any[]>(data);
const [currentPage, setCurrentPage] = useState(1);
const [searchTerm, setSearchTerm] = useState("");
const [sortColumn, setSortColumn] = useState("");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
```

**문제점**:

-   테이블 컴포넌트가 정렬, 검색, 페이지네이션 상태를 모두 관리
-   컴포넌트가 너무 복잡해짐
-   상태 동기화 문제 가능성

**shadcn/ui 원칙**:

-   제어 컴포넌트(Controlled Component) 패턴 선호
-   상태는 상위 컴포넌트에서 관리
-   또는 별도의 커스텀 훅으로 분리

---

### 7. 재사용성 문제 (Reusability Issues)

#### 7.1 도메인 특화 Props

**문제 위치**: 모든 컴포넌트

**문제점**:

-   `entityType`, `entity`, `fieldType` 등 도메인 특화 props
-   다른 프로젝트에서 재사용 불가능
-   컴포넌트가 특정 비즈니스 도메인에 종속됨

**shadcn/ui 원칙**:

-   범용적이고 재사용 가능한 컴포넌트
-   도메인 특화 로직은 래퍼 컴포넌트로 분리
-   컴포넌트 조합으로 복잡한 기능 구현

---

### 8. 코드 품질 문제 (Code Quality Issues)

#### 8.1 주석 처리된 코드

**문제 위치**: 여러 컴포넌트

**문제 코드**:

```tsx
// 🚨 Bad Practice: UI 컴포넌트가 도메인 타입을 알고 있음
```

**문제점**:

-   문제가 있음을 알지만 수정하지 않음
-   코드 리뷰 시 지적만 하고 개선하지 않음

**해결 방향**:

-   문제가 있는 코드는 즉시 리팩토링
-   주석 대신 개선된 코드로 교체

---

#### 8.2 사용하지 않는 Props

**문제 위치**: `packages/before/src/components/atoms/Badge.tsx`

**문제 코드**:

```tsx
showIcon = false,
}) => {
  void showIcon; // 사용하지 않음
```

**문제점**:

-   Props를 받지만 사용하지 않음
-   API가 불명확함
-   사용자 혼란 야기

**해결 방향**:

-   사용하지 않는 props 제거
-   또는 실제로 구현

---

## 문제점 요약표

| 카테고리      | 문제점                         | 심각도 | 영향 범위        |
| ------------- | ------------------------------ | ------ | ---------------- |
| 관심사 분리   | UI 컴포넌트에 도메인 로직 포함 | 높음   | 모든 컴포넌트    |
| 타입 안정성   | `any` 타입 남용                | 높음   | Table, Button 등 |
| 스타일 시스템 | 하드코딩된 인라인 스타일       | 중간   | Header, App 등   |
| 접근성        | ARIA 속성 부재                 | 높음   | 모든 컴포넌트    |
| 컴포넌트 구조 | 과도한 조건부 로직             | 중간   | Badge, Button 등 |
| 상태 관리     | 컴포넌트 내부 상태 과다        | 중간   | Table            |
| 재사용성      | 도메인 특화 Props              | 높음   | 모든 컴포넌트    |
| 코드 품질     | 주석 처리된 문제 코드          | 낮음   | 여러 컴포넌트    |

---

## shadcn/ui 원칙과의 비교

### shadcn/ui의 핵심 원칙

1. **순수한 UI 컴포넌트**: 도메인 로직 없음
2. **타입 안정성**: 완벽한 TypeScript 지원
3. **Tailwind CSS 기반**: 인라인 스타일 최소화
4. **접근성**: Radix UI 기반 자동 지원
5. **재사용성**: 범용적이고 조합 가능
6. **컴포넌트 조합**: 작은 컴포넌트를 조합하여 복잡한 UI 구성

### Before 패키지의 위반 사항

| shadcn/ui 원칙     | Before 패키지 상태        | 위반 여부 |
| ------------------ | ------------------------- | --------- |
| 순수한 UI 컴포넌트 | 도메인 로직 포함          | ❌        |
| 타입 안정성        | `any` 타입 사용           | ❌        |
| Tailwind CSS 기반  | 인라인 스타일, CSS 클래스 | ❌        |
| 접근성             | ARIA 속성 부재            | ❌        |
| 재사용성           | 도메인 특화 Props         | ❌        |
| 컴포넌트 조합      | 단일 컴포넌트에 모든 기능 | ❌        |

---

## 개선 방향

### 1. 관심사 분리

```tsx
// ❌ Before: 도메인 로직 포함
<Button entityType="user" action="delete" entity={user} />

// ✅ After: 순수 UI 컴포넌트
<Button variant="destructive" disabled={!canDelete(user)}>
  삭제
</Button>
```

### 2. 타입 안정성

```tsx
// ❌ Before
interface TableProps {
    data?: any[];
    onRowClick?: (row: any) => void;
}

// ✅ After
interface TableProps<T> {
    data?: T[];
    onRowClick?: (row: T) => void;
}
```

### 3. 스타일 시스템

```tsx
// ❌ Before
<header style={{ backgroundColor: '#ffffff' }}>

// ✅ After
<header className="bg-background border-b border-border">
```

### 4. 접근성

```tsx
// ❌ Before
<button onClick={onClose}>×</button>

// ✅ After
<button
  onClick={onClose}
  aria-label="닫기"
  className="..."
>
  ×
</button>
```

### 5. 컴포넌트 조합

```tsx
// ❌ Before: 하나의 컴포넌트에 모든 기능
<Table
  entityType="user"
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

// ✅ After: 컴포넌트 조합
<Table data={users}>
  <TableHeader>
    <TableRow>
      <TableHead>이름</TableHead>
      <TableHead>액션</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map(user => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <Button variant="outline" onClick={() => handleEdit(user)}>
            수정
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 마이그레이션 우선순위

### 높은 우선순위 (즉시 개선 필요)

1. **관심사 분리**: 도메인 로직을 UI 컴포넌트에서 제거
2. **타입 안정성**: `any` 타입을 명확한 타입으로 교체
3. **접근성**: ARIA 속성 및 키보드 네비게이션 추가

### 중간 우선순위

4. **스타일 시스템**: Tailwind CSS로 전환
5. **컴포넌트 구조**: 복잡한 로직을 별도 함수/훅으로 분리
6. **상태 관리**: 제어 컴포넌트 패턴 적용

### 낮은 우선순위

7. **코드 품질**: 주석 처리된 코드 정리
8. **문서화**: 컴포넌트 사용법 문서화

---

## 참고 자료

-   [shadcn/ui 가이드](./shadcn-ui-guide.md)
-   [디자인 토큰 명세서](./디자인 토큰 명세서.md)
-   [해결방안 명세서](./before해결방안.md)
-   [shadcn/ui 공식 문서](https://ui.shadcn.com)
-   [Radix UI 문서](https://www.radix-ui.com)

---

**작성일**: 2024년  
**분석 대상**: `packages/before` 폴더 전체  
**분석 기준**: shadcn/ui 원칙 및 현대적인 React 컴포넌트 설계 패턴
