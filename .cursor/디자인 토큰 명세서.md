# 디자인 토큰 명세서 (Design Tokens Specification)

## 개요

이 문서는 `packages/before` 폴더의 기존 스타일을 분석하여 추출한 디자인 토큰을 `packages/after`에서 사용하기 위한 명세서입니다.

## 작성 배경

### 문제 상황

-   `packages/before`: 하드코딩된 CSS 값들이 컴포넌트와 스타일 파일에 산재되어 있음
-   `packages/after`: Tailwind CSS 4.x를 사용하여 현대적인 디자인 시스템 구축 필요
-   디자인 일관성 유지: before의 시각적 디자인을 유지하면서 코드 품질 개선

### 해결 목표

1. before의 모든 스타일 값을 디자인 토큰으로 추출
2. Tailwind CSS 4.x의 `@theme` 블록을 활용한 토큰 시스템 구축
3. 재사용 가능하고 유지보수하기 쉬운 디자인 시스템 구축

## 디자인 토큰 구조

### 1. 컬러 토큰 (Colors)

#### 1.1 액션 컬러 (Action Colors)

```css
--color-primary: #1976d2;
--color-primary-hover: #1565c0;
--color-primary-border: #1565c0;
```

**이유**:

-   before의 `.btn-primary`에서 사용된 메인 액션 컬러
-   Primary 버튼의 기본, hover, border 상태를 명확히 구분
-   Tailwind에서 `bg-primary`, `hover:bg-primary-hover` 형태로 사용 가능

#### 1.2 상태 컬러 (Status Colors)

```css
--color-danger: #d32f2f;
--color-success: #388e3c;
--color-warning: #f57c00;
--color-info: #0288d1;
```

**이유**:

-   Button, Badge, Alert 등 다양한 컴포넌트에서 공통으로 사용
-   의미론적 네이밍으로 사용 의도가 명확함
-   각 상태별 hover, border 값도 함께 정의하여 일관성 유지

#### 1.3 텍스트 컬러 (Text Colors)

```css
--color-text-primary: #000;
--color-text-secondary: #333;
--color-text-tertiary: #666;
--color-text-disabled: rgba(0, 0, 0, 0.6);
```

**이유**:

-   before에서 다양한 텍스트 색상이 하드코딩되어 있음 (#333, #000, #666 등)
-   계층적 네이밍으로 중요도에 따른 사용이 명확함
-   rgba 값도 토큰화하여 투명도 관리 일원화

#### 1.4 배경 컬러 (Background Colors)

```css
--color-bg-primary: #fff;
--color-bg-secondary: #f5f5f5;
--color-bg-tertiary: #fafafa;
```

**이유**:

-   Card, Input disabled, Table 등에서 사용되는 배경색
-   Primary/Secondary/Tertiary 계층으로 구분하여 재사용성 향상

#### 1.5 보더 컬러 (Border Colors)

```css
--color-border-primary: #ccc;
--color-border-secondary: #ddd;
--color-border-tertiary: rgba(0, 0, 0, 0.12);
```

**이유**:

-   before에서 다양한 border 색상이 사용됨 (#ccc, #ddd, rgba 등)
-   용도별로 구분 (primary: 기본 input, secondary: hover, tertiary: card 등)
-   투명도가 다른 값들도 명확히 구분

### 2. 타이포그래피 토큰 (Typography)

#### 2.1 Font Families

```css
--font-family-primary: Arial, sans-serif;
--font-family-secondary: "Roboto", "Helvetica", "Arial", sans-serif;
```

**이유**:

-   before에서 두 가지 폰트 패밀리가 사용됨
    -   Arial: Button, Form, Badge 등
    -   Roboto: Card, Table, Modal 등
-   용도별로 구분하여 일관성 유지

#### 2.2 Font Sizes

```css
--font-size-xs: 0.625rem; /* 10px */
--font-size-sm: 0.75rem; /* 12px */
--font-size-base: 0.8125rem; /* 13px */
--font-size-md: 0.875rem; /* 14px */
```

**이유**:

-   before에서 사용된 모든 폰트 크기를 추출
-   rem 단위 사용으로 접근성 향상 (사용자 폰트 크기 설정 반영)
-   Tailwind의 표준 크기 체계와 유사하게 구성하여 호환성 확보

#### 2.3 Font Weights

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
```

**이유**:

-   before에서 사용된 폰트 굵기 값
-   숫자 값 사용으로 명확성 확보

### 3. 간격 토큰 (Spacing)

#### 3.1 기본 간격

```css
--spacing-xs: 4px;
--spacing-sm: 6px;
--spacing-md: 8px;
--spacing-lg: 10px;
```

**이유**:

-   before의 margin, padding 값들을 분석하여 공통 간격 추출
-   4px 기준의 간격 체계로 일관성 확보
-   컴포넌트별 특수한 간격은 별도 토큰으로 정의 (예: `--button-padding-md`)

#### 3.2 컴포넌트별 간격

```css
--button-padding-sm: 6px 12px;
--button-padding-md: 10px 20px;
--button-padding-lg: 12px 24px;
```

**이유**:

-   Button의 크기별 padding이 명확히 정의되어 있음
-   컴포넌트별 특수한 값은 별도 토큰으로 관리하여 재사용성 향상

### 4. Border Radius 토큰

```css
--radius-xs: 2px; /* Checkbox */
--radius-sm: 3px; /* Button, Input */
--radius-md: 4px; /* Card, Modal */
--radius-lg: 8px; /* Logo */
```

**이유**:

-   before에서 사용된 모든 border-radius 값 추출
-   용도별로 구분하여 일관성 유지
-   Tailwind의 radius 체계와 호환

### 5. 그림자 토큰 (Shadows)

```css
--shadow-card-default: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), ...;
--shadow-card-elevated: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), ...;
--shadow-modal: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), ...;
```

**이유**:

-   Material Design 스타일의 복잡한 그림자 값들
-   컴포넌트별로 다른 그림자 레벨을 명확히 구분
-   재사용을 위해 토큰화

## Tailwind CSS 4.x 통합 전략

### @theme 블록 사용 이유

1. **CSS 네이티브 방식**: Tailwind 4.x의 권장 방식
2. **타입 안정성**: CSS 변수로 정의하여 타입 체크 가능
3. **런타임 접근**: JavaScript에서도 `getComputedStyle`로 접근 가능
4. **설정 파일 불필요**: `tailwind.config.js` 없이도 작동

### 토큰 네이밍 규칙

1. **컬러**: `--color-{용도}-{변형}` 형식
    - 예: `--color-primary`, `--color-primary-hover`
2. **간격**: `--spacing-{크기}` 또는 `--{컴포넌트}-padding-{크기}`
    - 예: `--spacing-md`, `--button-padding-sm`
3. **타이포그래피**: `--font-{속성}-{크기}`
    - 예: `--font-size-md`, `--font-weight-bold`
4. **기타**: `--{속성}-{용도}`
    - 예: `--radius-sm`, `--shadow-card-default`

### 사용 방법

#### Tailwind 클래스로 사용

```html
<!-- 컬러 -->
<div class="bg-primary text-text-primary">Primary Button</div>
<div class="bg-danger hover:bg-danger-hover">Danger Button</div>

<!-- 간격 -->
<div class="p-md">Padding Medium</div>
<div class="gap-lg">Gap Large</div>

<!-- 타이포그래피 -->
<p class="text-sm font-medium">Medium Text</p>
```

#### CSS 변수로 직접 사용

```css
.custom-component {
    background-color: var(--color-primary);
    padding: var(--button-padding-md);
    border-radius: var(--radius-sm);
}
```

## 파일 구조

```
packages/after/src/styles/
├── design-tokens.css    # 디자인 토큰 정의 (@theme 블록)
├── globals.css          # 전역 스타일 및 Tailwind import
└── components.css       # 컴포넌트별 스타일 (필요시)
```

### design-tokens.css

-   모든 디자인 토큰을 `@theme` 블록에 정의
-   before의 스타일을 완전히 반영
-   주석으로 각 토큰의 용도와 출처 명시

### globals.css

-   `@import "tailwindcss"`로 Tailwind 로드
-   `@import "./design-tokens.css"`로 토큰 로드
-   기타 전역 스타일 정의

## 마이그레이션 전략

### 단계별 접근

1. **토큰 추출**: before의 모든 하드코딩된 값을 토큰으로 변환
2. **토큰 정의**: `design-tokens.css`에 `@theme` 블록으로 정의
3. **컴포넌트 마이그레이션**: after의 컴포넌트에서 토큰 사용
4. **검증**: Storybook으로 시각적 일관성 확인

### 호환성 유지

-   before의 시각적 결과물과 동일하게 보이도록 토큰 값 정확히 매핑
-   기존 컴포넌트 API는 유지하면서 내부 구현만 토큰 기반으로 변경

## 장점

1. **일관성**: 모든 컴포넌트가 동일한 디자인 토큰 사용
2. **유지보수성**: 값 변경 시 한 곳만 수정하면 전체 반영
3. **확장성**: 새로운 컴포넌트 추가 시 기존 토큰 재사용
4. **타입 안정성**: CSS 변수로 정의하여 오타 방지
5. **테마 지원**: 다크 모드 등 테마 전환 시 변수만 변경하면 됨

## 주의사항

1. **Tailwind 4.x 호환성**: `@theme` 블록의 컬러는 `--color-*` 형식이어야 Tailwind 클래스로 자동 변환됨
2. **복합 이름 처리**: `primary-foreground` 같은 복합 이름은 Tailwind에서 자동으로 인식되지 않을 수 있음
3. **CSS 변수 우선순위**: `@layer base`의 `:root` 변수와 `@theme` 블록의 변수가 충돌하지 않도록 주의

## 실제 사용 예시

### 컴포넌트에서 토큰 사용

#### Button 컴포넌트

```tsx
// Before (하드코딩)
<button className="btn btn-primary">Click</button>
// CSS: .btn-primary { background-color: #1976d2; }

// After (토큰 사용)
<button className="bg-primary hover:bg-primary-hover text-white border-primary-border">
  Click
</button>
// 또는 CSS 변수 직접 사용
<button style={{ backgroundColor: 'var(--color-primary)' }}>
  Click
</button>
```

#### Form Input 컴포넌트

```tsx
// Before
<input className="form-input" />
// CSS: .form-input { padding: 8px 10px; border: 1px solid #ccc; }

// After
<input className="px-[var(--input-padding)] border border-border-primary" />
```

### Tailwind 클래스 매핑

| 토큰              | Tailwind 클래스              | 설명             |
| ----------------- | ---------------------------- | ---------------- |
| `--color-primary` | `bg-primary`, `text-primary` | Primary 컬러     |
| `--color-danger`  | `bg-danger`, `text-danger`   | Danger 컬러      |
| `--spacing-md`    | `p-md`, `m-md` (커스텀)      | 중간 간격        |
| `--radius-sm`     | `rounded-sm`                 | 작은 둥근 모서리 |

**주의**: Tailwind 4.x에서 `@theme` 블록의 일부 토큰은 자동으로 클래스로 변환되지 않을 수 있습니다. 이 경우:

1. CSS 변수로 직접 사용: `style={{ padding: 'var(--button-padding-md)' }}`
2. Arbitrary values 사용: `p-[var(--spacing-md)]`
3. `tailwind.config.js`에서 추가 설정 (필요시)

## 참고 자료

-   [Tailwind CSS 4.x Documentation](https://tailwindcss.com/docs)
-   before 폴더의 `packages/before/src/styles/components.css`
-   Material Design Color System
