# Button 컴포넌트 문제점 상세 설명

## 개요

이 문서는 `packages/after/src/components/atoms/Button.tsx`의 문제점을 실제 코드 예시와 함께 구체적으로 설명합니다.

---

## 문제 1: UI 컴포넌트가 도메인 로직을 알고 있음

### 현재 코드

```typescript
// Button.tsx
interface ButtonProps {
  // 🚨 도메인 관심사 추가
  entityType?: 'user' | 'post';
  action?: 'create' | 'edit' | 'delete' | 'publish' | 'archive';
  entity?: any; // 엔티티 객체를 직접 받음
}

// 🚨 Bad Practice: UI 컴포넌트가 비즈니스 규칙을 판단함
if (entityType === 'user' && action === 'delete' && entity.role === 'admin') {
  actualDisabled = true;
}
```

### 왜 문제인가?

#### 시나리오 1: 다른 도메인에서 사용 불가능

**문제 상황:**
새로운 기능을 추가하려고 합니다. 예를 들어 "상품(Product)" 관리 기능을 만들고 싶습니다.

```typescript
// 상품 관리 페이지에서 버튼을 사용하려고 함
<Button 
  entityType="product"  // ❌ Button은 'user' | 'post'만 알고 있음
  action="sell"          // ❌ Button은 'create' | 'edit' | 'delete' | 'publish' | 'archive'만 알고 있음
  entity={product}
>
  판매하기
</Button>
```

**결과:**
- TypeScript 에러 발생: `entityType`은 `'user' | 'post'`만 허용
- Button 컴포넌트를 수정해야 함 → **재사용 불가능**

**올바른 방법:**
```typescript
// UI 컴포넌트는 순수하게 UI만 담당
<Button 
  variant="primary"     // ✅ UI 속성만
  disabled={!canSell}   // ✅ 비즈니스 로직은 상위에서 처리
  onClick={handleSell}
>
  판매하기
</Button>
```

#### 시나리오 2: 비즈니스 로직이 실제로 작동하지 않음

**문제 상황:**
Button 컴포넌트에는 관리자 삭제 불가 로직이 있지만, 실제로는 사용되지 않습니다.

**Button.tsx 코드:**
```typescript
// Button.tsx 내부 - 비즈니스 로직이 있음
if (entityType === 'user' && action === 'delete' && entity.role === 'admin') {
  actualDisabled = true;  // 관리자 삭제 불가
}
```

**하지만 실제 사용 (Table.tsx):**
```typescript
// Table.tsx - entityType, action, entity props를 전달하지 않음!
<Button size="sm" variant="danger" onClick={() => onDelete?.(row.id)}>
  삭제
</Button>
```

**결과:**
- Button 내부의 비즈니스 로직이 작동하지 않음
- 관리자든 일반 사용자든 둘 다 삭제 버튼이 활성화됨
- 코드와 실제 동작이 일치하지 않음
- 비즈니스 로직이 있지만 사용되지 않는 "죽은 코드(Dead Code)"

**왜 이런 일이 발생했나?**
- Button 컴포넌트의 API가 복잡함 (`entityType`, `action`, `entity` 모두 전달해야 함)
- 개발자가 편의를 위해 일반 버튼처럼 사용
- 비즈니스 로직이 UI 컴포넌트에 있어서 제대로 활용되지 않음

**올바른 방법:**
```typescript
// Table.tsx - 비즈니스 로직을 상위에서 처리
const canDelete = (user: User) => user.role !== 'admin';

<Button 
  variant="danger"
  disabled={!canDelete(row)}  // ✅ 명확하고 간단
  onClick={() => onDelete?.(row.id)}
>
  삭제
</Button>
```

**올바른 방법:**
```typescript
// ManagementPage.tsx (상위 컴포넌트)
const handleDelete = (user: User) => {
  // 비즈니스 규칙은 여기서 처리
  if (user.role === 'admin') {
    if (confirm('관리자를 삭제하시겠습니까?')) {
      // 삭제 로직
    }
    return;
  }
  // 일반 삭제 로직
};

// Button은 순수하게 UI만
<Button 
  variant="danger" 
  onClick={() => handleDelete(user)}
>
  삭제
</Button>
```

---

## 문제 2: 컴포넌트 재사용성 극도로 떨어짐

### 핵심 문제: 타입 제한으로 인한 도메인 종속

**중요:** 필수 속성이 많아서가 아니라, **타입 자체가 특정 도메인에 종속**되어 있어서 재사용성이 떨어집니다.

### 현재 Button 인터페이스

```typescript
interface ButtonProps {
  // ✅ 일반적인 UI props (재사용 가능)
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  
  // 🚨 문제: 타입이 특정 도메인에 종속됨
  entityType?: 'user' | 'post';  // ❌ 'user'와 'post'만 허용
  action?: 'create' | 'edit' | 'delete' | 'publish' | 'archive';  // ❌ 특정 액션만 허용
  entity?: any;
}
```

### 왜 문제인가?

**핵심:** 타입이 특정 도메인(`'user' | 'post'`)에 종속되어 있어서, **다른 도메인이나 다른 프로젝트에서 사용할 수 없습니다.**

#### 시나리오 1: 새로운 도메인 추가 시 타입 에러

**상황 A: 같은 프로젝트 내에서 새로운 도메인 추가**
```typescript
// 상품(Product) 관리 기능 추가
<Button 
  entityType="product"  // ❌ TypeScript 에러!
  // Type '"product"' is not assignable to type '"user" | "post"'
  action="sell"         // ❌ TypeScript 에러!
  // Type '"sell"' is not assignable to type '"create" | "edit" | "delete" | "publish" | "archive"'
  entity={product}
>
  판매하기
</Button>
```

**상황 B: 다른 프로젝트에서 재사용 시도**
```typescript
// 전자상거래 프로젝트
import { Button } from '@shared/components/Button';

<Button 
  entityType="order"  // ❌ 'user' | 'post'만 허용
  action="cancel"     // ❌ 정의된 액션에 없음
  entity={order}
>
  주문 취소
</Button>
```

**결과 (상황 A, B 모두 동일):**
- TypeScript 컴파일 에러 발생
- Button 컴포넌트의 타입 정의를 수정해야 함
- **Button 컴포넌트를 수정하지 않고는 사용 불가능**

**올바른 방법:**
```typescript
// UI 컴포넌트는 도메인과 무관하게 사용 가능
<Button 
  variant="primary"     // ✅ 도메인과 무관한 UI 속성
  onClick={handleSell}   // ✅ 비즈니스 로직은 상위에서
>
  판매하기
</Button>
```

#### 시나리오 2: 의미론적 혼란 (API 복잡성)

**상황:**
로그인 페이지에 "로그인" 버튼이 필요합니다. `entityType`, `action`, `entity` props는 선택적이지만, 타입 정의 자체가 혼란을 줍니다.

```typescript
// 로그인 페이지
<Button 
  onClick={handleLogin}
>
  로그인
</Button>
```

**문제점:**
1. **타입 정의에 도메인 특화 타입이 포함됨**
   - `entityType?: 'user' | 'post'` - 이 타입 자체가 특정 도메인을 암시
   - 개발자가 "이 버튼은 user/post 관리용인가?"라고 혼란스러워함

2. **API가 복잡하고 혼란스러움**
   - 선택적이지만, 언제 이 props를 사용해야 하는지 불명확
   - "로그인 버튼에 entityType을 전달해야 하나?" 같은 의문 발생

3. **의도가 불명확**
   - Button 컴포넌트를 보면 도메인 로직이 포함되어 있음
   - "순수한 UI 컴포넌트인가, 도메인 특화 컴포넌트인가?" 불명확

**올바른 방법:**
```typescript
// UI 컴포넌트는 범용적으로 사용 가능
<Button variant="primary" onClick={handleLogin}>
  로그인
</Button>

<Button variant="secondary" onClick={handleCancel}>
  취소
</Button>

<Button variant="danger" onClick={handleDelete}>
  삭제
</Button>
```

### 핵심 정리

**재사용성이 떨어지는 이유:**

1. ❌ **필수 속성이 많아서** (X)
   - 실제로는 선택적 속성임

2. ✅ **타입이 특정 도메인에 종속되어 있어서** (O)
   - `entityType?: 'user' | 'post'` - 새로운 도메인 추가 불가능
   - `action?: 'create' | 'edit' | ...` - 새로운 액션 추가 불가능
   - **같은 프로젝트 내 새로운 도메인 추가 시 타입 에러**
   - **다른 프로젝트에서 재사용 시 타입 에러**

3. ✅ **의미론적으로 혼란스러워서** (O)
   - "이 버튼은 user/post 전용인가?" 같은 의문
   - API가 복잡하고 사용법이 불명확

---

## 문제 3: 타입 안정성 부족

### 현재 코드

```typescript
entity?: any; // 엔티티 객체를 직접 받음
```

### 왜 문제인가?

#### 시나리오: 잘못된 속성 접근

```typescript
// user 객체를 전달했는데
<Button 
  entityType="user"
  action="delete"
  entity={user}  // { id: 1, username: "john", role: "admin" }
/>

// Button 내부에서
if (entityType === 'user' && action === 'delete' && entity.role === 'admin') {
  // ✅ 이건 작동함
}

// 하지만 실수로 post 객체를 전달하면?
<Button 
  entityType="user"  // user라고 했는데
  action="delete"
  entity={post}     // ❌ post 객체를 전달 (post에는 role이 없음!)
/>

// Button 내부에서
if (entityType === 'user' && action === 'delete' && entity.role === 'admin') {
  // ❌ entity.role이 undefined일 수 있음
  // ❌ TypeScript가 에러를 잡지 못함 (any 타입이므로)
}
```

**올바른 방법:**
```typescript
// 타입 안전한 방법
interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

// Button은 타입을 모름 (UI 컴포넌트이므로)
<Button 
  variant="danger"
  disabled={user.role === 'admin'}  // ✅ 타입 안전, 상위에서 처리
  onClick={() => handleDelete(user)}
>
  삭제
</Button>
```

---

## 문제 4: 테스트하기 어려움

### 현재 코드

```typescript
// Button.tsx 내부
if (entityType === 'user' && action === 'delete' && entity.role === 'admin') {
  actualDisabled = true;
}
```

### 왜 문제인가?

#### 시나리오: Button 컴포넌트 테스트

**테스트해야 할 경우의 수:**
1. `entityType="user"`, `action="delete"`, `entity.role="admin"` → disabled
2. `entityType="user"`, `action="delete"`, `entity.role="user"` → enabled
3. `entityType="post"`, `action="publish"`, `entity.status="published"` → disabled
4. `entityType="post"`, `action="publish"`, `entity.status="draft"` → enabled
5. `entityType="post"`, `action="archive"`, `entity.status="published"` → enabled
6. `entityType="post"`, `action="archive"`, `entity.status="draft"` → disabled
7. ... (계속 증가)

**문제점:**
- UI 컴포넌트 테스트가 비즈니스 로직 테스트가 됨
- 비즈니스 규칙이 변경될 때마다 Button 테스트도 수정 필요
- 테스트 케이스가 계속 증가

**올바른 방법:**
```typescript
// Button 테스트는 UI만 테스트
test('Button renders with variant', () => {
  render(<Button variant="primary">Click me</Button>);
  expect(screen.getByRole('button')).toHaveClass('btn-primary');
});

// 비즈니스 로직 테스트는 별도로
test('Admin user cannot be deleted', () => {
  const adminUser = { id: 1, role: 'admin' };
  const { result } = renderHook(() => useUserManagement());
  expect(result.current.canDelete(adminUser)).toBe(false);
});
```

---

## 문제 5: 관심사 분리 위반 (Separation of Concerns)

### 현재 구조

```
Button 컴포넌트
├── UI 렌더링 (버튼 스타일, 레이아웃)
├── 비즈니스 규칙 (관리자 삭제 불가, 게시 상태 체크)
├── 도메인 지식 (user, post 엔티티 구조)
└── 자동 레이블 생성 (action에 따라 텍스트 변경)
```

### 왜 문제인가?

**단일 책임 원칙(SRP) 위반:**
- Button 컴포넌트가 너무 많은 책임을 가짐
- UI 변경 시 비즈니스 로직까지 확인해야 함
- 비즈니스 로직 변경 시 UI 컴포넌트까지 수정 필요

**의존성 방향 문제:**
```
UI 컴포넌트 (Button)
    ↓ 의존
비즈니스 도메인 (user, post)
```

**올바른 의존성 방향:**
```
비즈니스 로직 (ManagementPage)
    ↓ 의존
UI 컴포넌트 (Button)
```

---

## 실제 비교: Before vs After

### Before (문제 있는 코드)

```typescript
// Button.tsx - 도메인 로직 포함
<Button 
  entityType="user"
  action="delete"
  entity={user}
/>

// Button 내부에서:
// - user.role === 'admin' 체크
// - disabled 여부 결정
// - "삭제" 텍스트 자동 생성
// - variant 자동 결정
```

**문제점:**
- Button이 user/post 도메인을 알고 있음
- 다른 도메인에서 재사용 불가능
- 비즈니스 규칙 변경 시 Button 수정 필요

### After (올바른 코드)

```typescript
// ManagementPage.tsx - 비즈니스 로직
const canDelete = (user: User) => {
  return user.role !== 'admin';
};

const handleDelete = (user: User) => {
  if (!canDelete(user)) {
    alert('관리자는 삭제할 수 없습니다');
    return;
  }
  // 삭제 로직
};

// Button.tsx - 순수 UI만
<Button 
  variant="danger"
  disabled={!canDelete(user)}
  onClick={() => handleDelete(user)}
>
  삭제
</Button>
```

**장점:**
- Button은 UI만 담당 (재사용 가능)
- 비즈니스 로직은 상위 컴포넌트에서 처리
- 다른 도메인에서도 동일한 Button 사용 가능
- 테스트하기 쉬움

---

## 결론

### Button 컴포넌트가 문제인 이유

1. **도메인 특화**: `user`, `post` 같은 특정 도메인에 종속됨
2. **비즈니스 로직 포함**: UI 컴포넌트가 비즈니스 규칙을 판단함
3. **재사용 불가능**: 다른 프로젝트나 도메인에서 사용 불가능
4. **타입 안정성 부족**: `any` 타입 사용으로 런타임 에러 가능
5. **테스트 어려움**: UI 테스트가 비즈니스 로직 테스트가 됨
6. **관심사 분리 위반**: UI와 비즈니스 로직이 섞여 있음

### 올바른 Button 컴포넌트

```typescript
// 순수한 UI 컴포넌트
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  // ✅ 도메인 관련 props 없음
  // ✅ 비즈니스 로직 없음
  // ✅ 순수하게 UI만 담당
}
```

### 비즈니스 로직은 어디에?

```typescript
// ManagementPage.tsx 또는 Custom Hook
const useUserManagement = () => {
  const canDelete = (user: User) => user.role !== 'admin';
  const handleDelete = (user: User) => { /* ... */ };
  
  return { canDelete, handleDelete };
};

// 사용
const { canDelete, handleDelete } = useUserManagement();

<Button 
  variant="danger"
  disabled={!canDelete(user)}
  onClick={() => handleDelete(user)}
>
  삭제
</Button>
```

---

## 참고: shadcn/ui 원칙

shadcn/ui의 Button 컴포넌트는:
- ✅ 순수한 UI 컴포넌트
- ✅ 도메인 로직 없음
- ✅ 범용적으로 재사용 가능
- ✅ 타입 안전성 보장
- ✅ 비즈니스 로직은 사용하는 쪽에서 처리

이것이 현대적인 컴포넌트 설계의 원칙입니다.

