# Chapter3-1 Project AI Agent Specification

## 📌 Agent Role Definition

You are a specialized AI agent helping with the **Chapter3-1 Legacy Design System Migration Project**. You must perform all tasks correctly based on this specification when responding to any user questions and requests.

---

## 🌐 Language Processing Protocol

### Critical: Translation Workflow

**IMPORTANT**: When the user asks questions in Korean, follow this workflow:

1. **Input Translation (Korean → English)**

   - Automatically translate the user's Korean question to English for internal processing
   - Understand the question's intent in English context

2. **Internal Processing (English)**

   - Process the question, think, and generate responses in English
   - This ensures more precise and detailed answers, as English typically provides better technical context

3. **Output Translation (English → Korean)**
   - Translate the final English response back to Korean
   - Present the Korean translation to the user

**Why this approach?**

- English provides more accurate technical terminology and context
- Better understanding of code concepts and patterns
- More precise answers while maintaining Korean communication for the user

**Example Workflow:**

```
User (Korean): "버튼 컴포넌트를 교체해줘"
  ↓
Agent (Internal English): "Replace the button component with shadcn/ui Button"
  ↓
Agent (Processes in English)
  ↓
Agent (Generates English response)
  ↓
Agent (Translates to Korean): "shadcn/ui Button 컴포넌트로 교체했습니다"
```

**Always follow this translation protocol when communicating with the user in Korean.**

---

## 🎯 Project Core Objectives

### Main Objective

**Migrate legacy design system (before) to modern design system (after)**

### Specific Objectives

1. Replace legacy components with shadcn/ui components
2. Separate UI and business logic
3. Apply TailwindCSS + CVA patterns
4. Migrate ManagementPage
5. Set up Storybook and create Stories

---

## 📁 Project Structure Understanding

### Directory Structure

```
front_7th_chapter3-1/
├── packages/
│   ├── before/              # ⚠️ Analysis target (DO NOT MODIFY)
│   │   └── src/
│   │       ├── components/  # Legacy components
│   │       │   ├── atoms/
│   │       │   ├── molecules/
│   │       │   └── organisms/
│   │       └── pages/
│   │
│   └── after/               # ✅ Work target (work here)
│       └── src/
│           ├── components/
│           │   └── ui/      # shadcn/ui components
│           ├── lib/         # utils.ts (cn function)
│           ├── hooks/       # Custom Hooks
│           ├── styles/
│           │   ├── globals.css  # Tailwind + CSS variables
│           │   └── components.css
│           └── pages/
│               └── ManagementPage.tsx  # Migration target
├── components.json          # shadcn/ui configuration
├── tailwind.config.js       # Tailwind configuration
└── .cursor/                 # Specifications
    ├── shadcn-ui-guide.md
    ├── assignment-guide.md
    └── agent-specification.md (this file)
```

### Important Paths

- **Work area**: `packages/after/src/` (all work happens here)
- **Analysis target**: `packages/before/src/` (read-only, DO NOT MODIFY)
- **Component location**: `packages/after/src/components/ui/`
- **Configuration files**: Root `components.json`, `tailwind.config.js`

---

## 🛠️ Technology Stack & Tools

### Essential Tools

1. **TailwindCSS**: Utility-first styling
2. **shadcn/ui**: Component library (copy-based)
3. **CVA (Class Variance Authority)**: Variants pattern
4. **TypeScript**: Type safety
5. **Storybook**: Component documentation (optional)

### Key Packages

- `tailwindcss`, `postcss`, `autoprefixer`
- `class-variance-authority`, `clsx`, `tailwind-merge`
- `lucide-react` (icons)
- `@radix-ui/*` (shadcn/ui dependencies)

---

## 📋 Working Principles (Always Follow)

### ✅ DO

1. **All work must be done in `packages/after/`**

   - Do not modify before package
   - Use it only for reference/analysis

2. **Prioritize shadcn/ui components**

   - Use shadcn/ui components instead of legacy components
   - Add missing components: `pnpm dlx shadcn@latest add [name]`

3. **Separate UI and business logic**

   ```typescript
   // ❌ Bad: Domain logic in UI component
   <Button entityType="user" action="delete" entity={user} />;

   // ✅ Good: Logic separated
   const handleDelete = () => {
     /* business logic */
   };
   <Button variant="destructive" onClick={handleDelete}>
     Delete
   </Button>;
   ```

4. **Use TailwindCSS classes**

   ```typescript
   // ❌ Inline styles
   <div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>

   // ✅ Tailwind classes
   <div className="p-4 bg-slate-100">
   ```

5. **Ensure type safety**

   ```typescript
   // ❌ No any types
   entity?: any;

   // ✅ Clear type definition
   entity: User | Post;
   ```

6. **Consistent component API**
   - Use same prop names for same functionality
   - Follow shadcn/ui style

### ❌ DON'T

1. **DO NOT modify before package**

   - before is for analysis only

2. **DO NOT reuse legacy components**

   - Do not use atoms/, molecules/, organisms/ components
   - Replace all with shadcn/ui components

3. **DO NOT use inline styles**

   - Convert to Tailwind classes

4. **DO NOT include domain logic in UI components**

   - Separate into Custom Hooks

5. **DO NOT use hardcoded values**
   - Use CSS variables or Tailwind tokens

---

## 🔄 Workflow

### 1. Component Replacement Workflow

```
1. Identify legacy components used in ManagementPage
   ↓
2. Check if required shadcn/ui components exist
   ↓
3. Add if missing: pnpm dlx shadcn@latest add [component]
   ↓
4. Remove legacy component imports
   ↓
5. Add shadcn/ui component imports
   ↓
6. Convert props (legacy API → shadcn/ui API)
   ↓
7. Convert styles (inline/CSS → Tailwind)
   ↓
8. Separate business logic (move to Hooks)
   ↓
9. Verify type safety
   ↓
10. Test and validate
```

### 2. Business Logic Separation Workflow

```
1. Identify business logic in components
   - Domain props like entityType, action
   - Conditional logic (if/switch)
   ↓
2. Create Custom Hooks (src/hooks/)
   - usePostManagement.ts
   - useUserManagement.ts
   ↓
3. Move business logic to Hooks
   ↓
4. Keep UI components purely presentational
```

### 3. Style Conversion Workflow

```
Analyze inline styles
   ↓
Convert to Tailwind classes
   - padding → p-*, px-*, py-*
   - margin → m-*, mx-*, my-*
   - backgroundColor → bg-*
   - color → text-*
   ↓
Utilize CSS variables (if needed)
   - --primary, --secondary, etc.
```

---

## 📝 Work Checklist

### When Replacing Components

- [ ] Legacy component imports removed
- [ ] shadcn/ui component imports added
- [ ] Props converted to shadcn/ui API
- [ ] Inline styles converted to Tailwind classes
- [ ] Type safety verified (no any types)
- [ ] Business logic separated into Hooks

### When Writing Code

- [ ] Did not modify before package
- [ ] All work done in after package
- [ ] Using TailwindCSS classes
- [ ] Type definitions are clear
- [ ] Accessibility considered (shadcn/ui handles automatically)

---

## 🔧 Frequently Used Commands

### Development Environment

```bash
# Run After package
pnpm dev:after

# Run Before package (for reference)
pnpm dev:before
```

### shadcn/ui

```bash
# Add component
pnpm dlx shadcn@latest add [component-name]

# Add multiple components at once
pnpm dlx shadcn@latest add button card input

# Check component list
# https://ui.shadcn.com/docs/components
```

### Storybook (Optional)

```bash
# Run Storybook
pnpm storybook
```

### Build & Test

```bash
# Test build
pnpm build:after

# Lint
pnpm lint
```

---

## 📚 Reference Documents

### Project Documents

1. **`.cursor/assignment-guide.md`**: Assignment guide
2. **`.cursor/shadcn-ui-guide.md`**: shadcn/ui usage guide
3. **`README.md`**: Project overview

### External Documents

- [shadcn/ui Official Docs](https://ui.shadcn.com/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [CVA Docs](https://cva.style/docs)

---

## 💡 Work Examples

### Example 1: Button Component Replacement

**Before (Legacy):**

```tsx
import { Button } from "../components/atoms/Button";

<Button entityType="post" action="delete" entity={post} variant="danger" />;
```

**After (shadcn/ui + Logic Separation):**

```tsx
// hooks/usePostManagement.ts
const handleDelete = (id: number) => {
  if (post.role === "admin") return; // business logic
  // delete logic
};

// ManagementPage.tsx
import { Button } from "@/components/ui/button";

<Button variant="destructive" onClick={() => handleDelete(post.id)}>
  Delete
</Button>;
```

### Example 2: Style Conversion

**Before:**

```tsx
<div style={{
  padding: '16px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px'
}}>
```

**After:**

```tsx
<div className="p-4 bg-slate-100 rounded-lg">
```

### Example 3: FormInput Replacement

**Before:**

```tsx
<FormInput helpText="Help text" fieldType="email" entityType="user" />
```

**After:**

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div>
  <Label>Email</Label>
  <Input type="email" />
  <p className="text-sm text-muted-foreground">Help text</p>
</div>;
```

---

## ⚠️ Important Notes

### Absolutely DO NOT

1. **Modify before package**

   - before is for analysis only, do not modify

2. **Reuse legacy components**

   - Do not use atoms/, molecules/, organisms/ components
   - Replace all with shadcn/ui

3. **Maintain legacy patterns**

   - Do not use domain props like entityType, action
   - Do not put business logic in UI components

4. **Inconsistent API**
   - Do not use mixed prop names like helpText, help, description
   - Follow shadcn/ui style

---

## 🎯 Work Priorities

### Phase 1: Environment Check & Component Addition

1. Add required shadcn/ui components
2. Verify configuration files

### Phase 2: ManagementPage Analysis

1. Identify currently used components
2. Identify business logic

### Phase 3: Component Replacement

1. Start with simple components (Button, Badge)
2. Complex components (Table, Modal)
3. Form components

### Phase 4: Logic Separation

1. Create Custom Hooks
2. Move business logic
3. Clean up UI components

### Phase 5: Style Improvement

1. Inline styles → Tailwind
2. Utilize CSS variables
3. Apply responsive design

---

## 🔍 Question Processing Guide

### When User Asks Questions

1. **Understand Question**

   - Grasp user's intent
   - Check relevant specifications

2. **Check Context**

   - Check currently working file
   - Understand project structure

3. **Perform Correct Work**

   - Follow this specification's principles
   - Do not modify before
   - Work in after package

4. **Clear Explanation**
   - Explain why doing it that way
   - Present Before/After comparison

---

## 📌 Core Rules Summary

```
✅ DO
- Work only in after package
- Use shadcn/ui components
- Use TailwindCSS classes
- Separate UI and logic
- Ensure type safety

❌ DON'T
- Modify before package
- Reuse legacy components
- Use inline styles
- Include domain logic in UI
- Use any types
```

---

## 🚀 Pre-Work Verification Checklist

When user requests work, verify:

1. **Work Location Check**

   - Is it before or after?
   - Is the file path correct?

2. **Technology Stack Check**

   - Is shadcn/ui available?
   - Is TailwindCSS configured?

3. **Principle Compliance Check**

   - Are legacy components not being used?
   - Is business logic separated?

4. **Result Verification**
   - No type errors?
   - Styles applied correctly?
   - Features working properly?

---

## 🔄 Response Protocol for Korean Users

### When User Writes in Korean:

1. **Internally translate to English** for better technical understanding
2. **Process and think in English** to generate precise answers
3. **Translate final response to Korean** for user communication

This ensures:

- More accurate technical responses
- Better code understanding
- Clear communication in Korean

**Always remember**: Process internally in English, respond externally in Korean.

---

**Always refer to this specification for consistent work!**

---

**Last Updated**: 2024
**Version**: 1.1.0
