# Campus Core — Coding Agent Master Prompt & Development Rules

# Purpose

This document defines the master instructions, engineering standards, coding principles, UI expectations, architecture rules, and behavioral guidelines for any coding agent working on Campus Core.

The coding agent must follow this document strictly.

This is NOT optional guidance.
This is the project operating system.

---

# 1. Project Identity

## Project Name
Campus Core

## Product Description
Campus Core is a modern student operating system designed to help college students manage:
- attendance
- assignments
- exams
- timetables
- academic progress
- productivity

The product must feel:
- premium
- modern
- clean
- fast
- organized
- mobile-first
- startup-quality

The application must NOT feel like:
- a tutorial project
- a generic dashboard clone
- outdated academic software
- a cluttered ERP system

---

# 2. Core Development Philosophy

## Primary Goal
Build a real-world production-quality application.

The objective is NOT:
- experimenting randomly
- overengineering
- adding excessive features
- using complex architecture unnecessarily

The objective IS:
- building a stable product
- solving real student problems
- delivering excellent UX
- maintaining clean architecture
- shipping polished features

---

# 3. Non-Negotiable Rules

## Rule 1 — Mobile-First Development
Every screen must be designed mobile-first.

Desktop layouts should expand naturally from mobile.

Never prioritize desktop over mobile.

---

## Rule 2 — Consistency Over Creativity
Do NOT create inconsistent layouts.

Maintain consistency in:
- spacing
- typography
- card styles
- button styles
- colors
- icon sizes
- border radius
- shadows

Consistency creates premium UI.

---

## Rule 3 — Simplicity Wins
Avoid unnecessary complexity.

Do NOT:
- add excessive abstractions
- overcomplicate state management
- use unnecessary libraries
- create giant components
- build features not in scope

---

## Rule 4 — Clean Code Only
Code must be:
- readable
- modular
- scalable
- maintainable
- typed properly

Avoid:
- spaghetti code
- deeply nested logic
- duplicated logic
- massive files

---

## Rule 5 — UX Matters More Than Fancy Effects
The application should feel:
- smooth
- intuitive
- calm
- responsive

Do NOT rely on:
- excessive animations
- flashy gradients
- visual clutter

Good UX > flashy UI.

---

# 4. Tech Stack (Strict)

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand

## Backend / Database
- Supabase
- PostgreSQL
- Supabase Auth

## Deployment
- Vercel
- Supabase Cloud

Do NOT replace technologies unless explicitly instructed.

---

# 5. Folder Structure Rules

## Required Structure

```txt
app/
components/
features/
hooks/
lib/
services/
store/
types/
utils/
constants/
styles/
```

---

## Folder Responsibilities

### components/
Reusable UI components only.

### features/
Feature-specific logic and components.

### services/
API and Supabase interaction logic.

### hooks/
Custom hooks.

### store/
Zustand stores.

### lib/
Shared utilities and configurations.

### utils/
Pure helper functions.

---

# 6. Component Rules

## Components Must Be:
- reusable
- small
- composable
- readable

---

## Avoid:
- giant 500-line components
- duplicated UI logic
- inline massive functions
- repeated styling

---

## Preferred Pattern

```tsx
<Page>
  <Section>
    <Card>
      <Component />
    </Card>
  </Section>
</Page>
```

---

# 7. Naming Conventions

## Components
PascalCase

Example:
```tsx
AttendanceCard.tsx
```

---

## Hooks
camelCase with use prefix

Example:
```tsx
useAssignments.ts
```

---

## Services
camelCase

Example:
```tsx
attendanceService.ts
```

---

## Constants
UPPER_SNAKE_CASE

Example:
```ts
MAX_ATTENDANCE_LIMIT
```

---

# 8. TypeScript Rules

## Strict Type Safety Required

Do NOT:
- use any unnecessarily
- ignore type issues
- bypass types lazily

---

## Always Create Types
Use:
- interfaces
- type definitions
- reusable models

Example:

```ts
interface Subject {
  id: string
  subjectName: string
  totalClasses: number
  attendedClasses: number
}
```

---

# 9. State Management Rules

## Use Zustand Only When Needed

Global state should only handle:
- auth session
- global UI state
- shared filters
- modals

Do NOT store everything globally.

Use local state whenever possible.

---

# 10. Supabase Rules

## Security Rules
- Enable Row Level Security (RLS)
- Users must only access their own data
- Never expose sensitive keys

---

## Database Rules
Do NOT store calculated values.

Instead:
- calculate dynamically
- derive values from source data

Example:
Do NOT store:
- attendance_percentage
- CGPA

Store:
- attended_classes
- total_classes
- grades
- credits

---

# 11. UI Design Rules

# Design Philosophy

Campus Core should feel:
- premium
- organized
- modern
- calm
- minimal

Inspired by:
- Linear
- Notion
- Vercel
- Raycast

---

# 12. Spacing Rules

Spacing consistency is mandatory.

## Use predictable spacing scale:

```txt
2
4
6
8
12
16
20
24
32
```

Do NOT use random spacing values.

---

# 13. Typography Rules

## Preferred Font
Geist

Alternative:
Inter

---

## Typography Principles
- Clear hierarchy
- Strong readability
- Consistent sizes
- Proper line heights

Avoid:
- tiny unreadable text
- inconsistent font weights
- cramped layouts

---

# 14. Color Rules

## Design Direction
Dark premium UI.

### Background
Near-black backgrounds.

### Accent
Use ONE primary accent color consistently.

Recommended:
- electric blue
- violet
- emerald
- cyan

---

## Avoid
- rainbow color palettes
- excessive gradients
- oversaturated UI
- glowing effects everywhere

---

# 15. Animation Rules

## Framer Motion Usage
Allowed for:
- page transitions
- modals
- hover interactions
- smooth entrances
- loading interactions

---

## Avoid
- distracting animations
- excessive motion
- slow transitions
- animation overload

Animations should feel subtle and premium.

---

# 16. Accessibility Rules

The app must remain usable.

## Requirements
- proper contrast
- keyboard navigation
- accessible buttons
- semantic HTML
- responsive text
- touch-friendly spacing

---

# 17. Performance Rules

## Optimize For:
- fast loading
- smooth rendering
- responsive mobile performance
- minimal rerenders

---

## Avoid
- unnecessary API calls
- huge component trees
- excessive client-side computation
- unoptimized rendering

---

# 18. Error Handling Rules

Every async operation must handle:
- loading state
- success state
- empty state
- error state

Never leave blank screens.

---

# 19. Forms & Validation Rules

## Forms Must:
- validate properly
- show helpful errors
- prevent invalid submissions
- feel responsive

Use:
- react-hook-form
- zod

Recommended.

---

# 20. Responsive Design Rules

## Mobile Is Primary
Layouts must work perfectly on:
- phones
- tablets
- desktops

---

## Mobile Navigation
Use bottom navigation.

---

## Desktop Navigation
Use sidebar layout.

---

# 21. Dashboard Rules

The dashboard is the heart of Campus Core.

It must immediately communicate:
- organization
- clarity
- productivity

---

## Dashboard Must Include
- attendance overview
- assignments overview
- upcoming exams
- today’s schedule
- quick statistics

---

## Dashboard Should Feel
- calm
- organized
- premium
- informative

Never clutter the dashboard.

---

# 22. Attendance Module Rules

Attendance is the hero feature.

It must feel:
- instant
- useful
- frictionless

---

## Required Features
- attendance percentage
- attended/missed tracking
- safe bunk calculation
- subject management

---

## UX Goals
Users should update attendance in seconds.

Avoid unnecessary complexity.

---

# 23. Assignment Module Rules

Assignments should be:
- easy to add
- easy to track
- visually clear

---

## Required Features
- due dates
- priorities
- completion status
- filtering

---

# 24. Timetable Rules

Timetable UI must:
- be visually clean
- work well on mobile
- be easy to scan quickly

---

## Important
Avoid overly complicated calendar systems.

Simple and readable wins.

---

# 25. CGPA Module Rules

The CGPA system should:
- feel lightweight
- be accurate
- support semester grouping

Calculations must be reliable.

---

# 26. Reusable UI Components

Must create reusable:
- buttons
- cards
- dialogs
- inputs
- dropdowns
- loaders
- empty states
- navigation items
- stat cards

Avoid duplicated components.

---

# 27. Git & Commit Rules

## Commit Messages Must Be Clear

Examples:

```txt
feat: add attendance tracking
fix: resolve mobile navbar overflow
refactor: simplify dashboard card layout
style: improve spacing consistency
```

Avoid vague commits like:

```txt
update
changes
fixed stuff
```

---

# 28. Code Quality Rules

Before completing any feature:

## Verify:
- responsiveness
- accessibility
- loading states
- empty states
- error handling
- mobile usability
- clean spacing
- reusable structure

---

# 29. Things the Coding Agent Must NEVER Do

## NEVER:
- add random features
- change stack without approval
- ignore responsiveness
- ignore accessibility
- hardcode important values
- create inconsistent UI
- leave debugging code
- commit broken layouts
- overengineer simple problems
- use poor naming conventions

---

# 30. Development Workflow

# Step 1
Understand the feature fully.

# Step 2
Plan UI and data flow.

# Step 3
Build reusable components first.

# Step 4
Implement feature logic.

# Step 5
Test responsiveness.

# Step 6
Polish UX and spacing.

# Step 7
Refactor if necessary.

# Step 8
Ship feature.

---

# 31. Quality Standard

Campus Core should feel like:
- a funded startup product
- a polished productivity app
- a modern SaaS platform

It must NOT feel like:
- a student side project
- a rushed dashboard template
- a tutorial clone

---

# 32. Product Priorities

Priority order:

1. Stability
2. Mobile UX
3. Clean architecture
4. Performance
5. Visual polish
6. Scalability
7. Additional features

---

# 33. Future Scalability Guidelines

The architecture should allow future expansion into:
- AI features
- notes system
- placement tracking
- notifications
- collaborative features
- advanced analytics

But V1 must remain focused.

---

# 34. Final Mission Statement

Build Campus Core as a beautiful, modern, and highly usable academic productivity system for students.

Every feature must:
- solve a real problem
- reduce friction
- improve organization
- feel premium
- maintain simplicity

The final product should make students feel:
- more organized
- more productive
- less overwhelmed
- more in control of th