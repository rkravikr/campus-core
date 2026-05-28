# Campus Core — Product Requirements Document (PRD)

## Product Name
Campus Core

---

# 1. Product Overview

## Vision
Campus Core is a modern student operating system designed to help college students manage academics, attendance, assignments, exams, schedules, and academic performance from one clean and organized workspace.

The goal is to replace scattered workflows involving:
- WhatsApp groups
- Notes apps
- Calendar apps
- Manual attendance tracking
- Spreadsheet CGPA calculators
- Messy college ERP systems

Campus Core aims to provide a fast, beautiful, mobile-first experience specifically tailored for college students.

---

# 2. Product Goals

## Primary Goals
- Help students stay academically organized.
- Reduce academic chaos.
- Make attendance tracking effortless.
- Improve productivity through clarity and structure.
- Deliver a premium UI/UX experience.
- Build a scalable foundation for future AI-powered features.

---

# 3. Target Audience

## Initial Target Users
- Indian engineering students
- College students managing multiple subjects and assignments
- Students struggling with attendance tracking and academic organization

---

# 4. Product Philosophy

Campus Core should feel:
- Minimal
- Premium
- Organized
- Calm
- Fast
- Reliable
- Modern

The UI should feel like a high-quality productivity startup product.

The app should NOT feel:
- Cluttered
- Cartoonish
- Over-animated
- Corporate ERP-like
- Academic software from 2005

---

# 5. V1 Scope

## Included Features

### Authentication
- Email/password login
- Google login
- User profile creation
- Protected routes
- Session persistence

### Dashboard
- Attendance overview
- Upcoming assignments
- Upcoming exams
- Today’s timetable
- Quick academic statistics
- Welcome section

### Attendance Tracker
- Add/edit/delete subjects
- Track total classes
- Track attended classes
- Attendance percentage calculation
- Safe bunk calculation
- Attendance warnings

### Assignment Tracker
- Add assignments
- Edit assignments
- Delete assignments
- Mark assignment as completed
- Due date tracking
- Priority tagging
- Subject linking

### Timetable
- Weekly timetable view
- Add/edit/delete classes
- Time slots
- Room information
- Mobile-friendly layout

### CGPA Calculator
- Add semester grades
- Credit-based SGPA calculation
- Overall CGPA calculation
- Grade management

### User Settings
- Update profile
- Dark/light mode later (optional)
- Logout

---

# 6. Out of Scope for V1

These features are intentionally excluded from V1:

- AI assistant
- Chat system
- Student communities
- Real-time collaboration
- Notifications
- Placement tracking
- Notes uploads
- File sharing
- Social features
- Multi-user classrooms
- Advanced analytics
- Offline support
- Native mobile app

These may be added in later versions.

---

# 7. Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand

## Backend / BaaS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage (future)

## Deployment
- Vercel (Frontend)
- Supabase Cloud (Backend + DB)

## Development Tools
- Git
- GitHub
- ESLint
- Prettier
- Husky (optional)
- VS Code

---

# 8. Architecture

## Architecture Style
Frontend-heavy architecture using Supabase as backend service.

## Frontend Responsibilities
- UI rendering
- State management
- Client-side validation
- User interactions
- Dashboard calculations
- API calls

## Supabase Responsibilities
- Authentication
- PostgreSQL database
- Row-level security
- CRUD operations
- Future storage support

---

# 9. Folder Structure

## Recommended Structure

```txt
campus-core/
│
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── store/
├── styles/
├── types/
├── utils/
├── public/
├── supabase/
├── constants/
└── README.md
```

---

# 10. Database Schema

## profiles

```sql
id UUID PRIMARY KEY
full_name TEXT
college_name TEXT
course TEXT
semester INTEGER
created_at TIMESTAMP
```

## subjects

```sql
id UUID PRIMARY KEY
user_id UUID
subject_name TEXT
total_classes INTEGER
attended_classes INTEGER
created_at TIMESTAMP
```

## assignments

```sql
id UUID PRIMARY KEY
user_id UUID
subject_id UUID
title TEXT
description TEXT
due_date TIMESTAMP
priority TEXT
completed BOOLEAN
created_at TIMESTAMP
```

## exams

```sql
id UUID PRIMARY KEY
user_id UUID
subject_id UUID
exam_type TEXT
exam_date TIMESTAMP
created_at TIMESTAMP
```

## timetable

```sql
id UUID PRIMARY KEY
user_id UUID
subject_id UUID
day TEXT
start_time TIME
end_time TIME
room TEXT
created_at TIMESTAMP
```

## grades

```sql
id UUID PRIMARY KEY
user_id UUID
semester INTEGER
subject_name TEXT
credits INTEGER
grade TEXT
created_at TIMESTAMP
```

---

# 11. Database Rules

## Important Principles

### NEVER store calculated values unnecessarily.

Do NOT store:
- attendance_percentage
- SGPA
- CGPA

Instead calculate them dynamically.

### Use Row Level Security (RLS)
Every user must only access their own data.

### Use UUIDs
All tables should use UUID primary keys.

---

# 12. Design System

## Design Philosophy
- Minimal
- Clean
- Premium
- Smooth
- Mobile-first
- High readability

## UI Style
Inspired by:
- Linear
- Notion
- Vercel
- Raycast

## Typography
Preferred:
- Geist

Alternative:
- Inter

## Color Direction
### Background
- Near-black dark background

### Accent Color
Choose one consistent accent color:
- Electric blue
- Violet
- Emerald
- Cyan

## UI Rules
- Consistent spacing
- Consistent typography scale
- Rounded corners
- Subtle shadows
- Minimal gradients
- Smooth transitions
- Clean hierarchy

---

# 13. Mobile-First Strategy

Campus Core should be designed mobile-first.

## Mobile Navigation
Bottom navigation bar:
- Home
- Attendance
- Assignments
- Timetable
- Profile

## Desktop Navigation
Sidebar navigation.

---

# 14. Core Screens

## Authentication Screens
- Login
- Signup
- Forgot password

## Main Screens
- Dashboard
- Attendance
- Assignments
- Timetable
- Exams
- CGPA
- Profile
- Settings

## Modals
- Add Subject
- Add Assignment
- Add Exam
- Add Timetable Entry
- Add Grade

---

# 15. Feature Requirements

## Dashboard Requirements

### Must Include
- Attendance summary cards
- Upcoming assignments
- Upcoming exams
- Today’s classes
- Quick stats

### UX Requirements
- Fast loading
- Responsive layout
- Skeleton loaders
- Empty states

---

## Attendance Tracker Requirements

### Features
- Add subjects
- Increment attended classes
- Increment missed classes
- View attendance percentage
- Safe bunk calculation

### Logic
Safe bunk formula should calculate:
- how many classes can be missed before falling below threshold

Threshold default:
- 75%

---

## Assignment Tracker Requirements

### Features
- Create assignment
- Edit assignment
- Delete assignment
- Set priority
- Mark complete
- Due dates

### Priorities
- Low
- Medium
- High

---

## Timetable Requirements

### Features
- Weekly schedule
- Time blocks
- Subject linking
- Room info

### UX
- Mobile optimized
- Clean timetable grid

---

## CGPA Calculator Requirements

### Features
- Add grades
- Add credits
- Semester grouping
- SGPA calculation
- CGPA calculation

---

# 16. Authentication Requirements

## Authentication Methods
- Email/password
- Google OAuth

## Security Requirements
- Protected routes
- Session persistence
- Secure Supabase auth usage

---

# 17. State Management

## Use Zustand

Global state examples:
- User session
- UI preferences
- Global modals
- Temporary filters

Do NOT overuse global state.

---

# 18. API & Data Handling

## Principles
- Keep API logic separated.
- Use reusable service functions.
- Avoid duplicated queries.
- Use proper loading and error states.

## Suggested Structure

```txt
services/
├── auth.service.ts
├── attendance.service.ts
├── assignment.service.ts
├── exam.service.ts
├── timetable.service.ts
└── grade.service.ts
```

---

# 19. Performance Requirements

## Requirements
- Fast initial load
- Optimized rendering
- Responsive animations
- Mobile performance optimization
- Lazy loading where needed

## Avoid
- Heavy unnecessary animations
- Huge component files
- Unoptimized rerenders

---

# 20. Accessibility Requirements

## Requirements
- Proper contrast
- Keyboard navigation
- Accessible buttons
- Semantic HTML
- Mobile usability

---

# 21. Error Handling

## Requirements
- User-friendly error messages
- Validation messages
- Fallback states
- Empty states
- Loading states

Never leave blank screens.

---

# 22. Development Phases

# Phase 1 — Project Setup

## Tasks
- Initialize Next.js project
- Setup TypeScript
- Setup Tailwind
- Setup shadcn/ui
- Setup Supabase
- Configure environment variables
- Configure linting
- Setup folder structure
- Setup routing
- Setup layout system

## Deliverables
- Working base app
- Theme setup
- Navigation setup
- Auth connection

---

# Phase 2 — Authentication

## Tasks
- Login page
- Signup page
- Google auth
- Protected routes
- Session handling

## Deliverables
- Secure authentication flow

---

# Phase 3 — Core Data Models

## Tasks
- Setup database schema
- Create tables
- Configure RLS policies
- Create CRUD services

## Deliverables
- Fully connected database

---

# Phase 4 — Attendance Module

## Tasks
- Subject CRUD
- Attendance tracking
- Percentage calculations
- Safe bunk logic
- UI implementation

## Deliverables
- Fully functional attendance system

---

# Phase 5 — Assignment Module

## Tasks
- Assignment CRUD
- Priority system
- Due date handling
- Completion status

## Deliverables
- Functional assignment management

---

# Phase 6 — Timetable Module

## Tasks
- Weekly timetable
- Time slots
- Mobile optimization

## Deliverables
- Timetable management

---

# Phase 7 — CGPA Module

## Tasks
- Grade management
- Credit handling
- SGPA calculation
- CGPA calculation

## Deliverables
- Functional CGPA system

---

# Phase 8 — Dashboard Integration

## Tasks
- Dashboard cards
- Aggregated statistics
- Upcoming events
- Quick overview widgets

## Deliverables
- Complete dashboard experience

---

# Phase 9 — UI/UX Polish

## Tasks
- Animations
- Empty states
- Skeleton loaders
- Responsive fixes
- Typography refinement
- Spacing refinement
- Accessibility improvements

## Deliverables
- Production-quality UI

---

# Phase 10 — Deployment

## Tasks
- Vercel deployment
- Environment setup
- Supabase production setup
- Final testing

## Deliverables
- Public live version

---

# 23. Coding Standards

## Rules
- Use TypeScript everywhere.
- Avoid massive components.
- Use reusable UI components.
- Use clean naming conventions.
- Separate logic from UI.
- Use proper folder organization.
- Avoid hardcoded values.
- Use constants/config files.

## Naming Conventions

### Components
PascalCase

Example:
```ts
AttendanceCard.tsx
```

### Hooks
camelCase with use prefix

Example:
```ts
useAttendance.ts
```

### Services
camelCase

Example:
```ts
attendanceService.ts
```

---

# 24. UI Component Guidelines

## Reusable Components
Create reusable:
- Buttons
- Cards
- Modals
- Inputs
- Select dropdowns
- Navigation components
- Stats cards
- Empty states
- Skeleton loaders

## Avoid
- Duplicate styling
- Repeated layout code
- Inconsistent spacing

---

# 25. Animation Guidelines

## Use Framer Motion Sparingly

Good usage:
- Page transitions
- Modal animations
- Hover states
- Card entrances
- Loading interactions

Avoid:
- Excessive motion
- Distracting animations
- Slow transitions

Animations should feel smooth and premium.

---

# 26. Future Roadmap (Post V1)

## Possible V2 Features
- AI study planner
- AI notes summarizer
- Smart attendance predictions
- Exam preparation assistant
- Notes uploads
- Placement tracker
- Notifications
- Calendar sync

## Possible V3 Features
- Student communities
- Shared resources
- Public profiles
- Collaborative spaces
- College ecosystems

---

# 27. Success Metrics

## Product Success Indicators
- Daily active usage
- Repeat user engagement
- Low friction workflows
- Positive UI feedback
- Consistent feature usage

## Important KPI
Most important metric:
- Daily return rate

Campus Core should become part of a student’s daily workflow.

---

# 28. Risks & Challenges

## Risks
- Feature overload
- Scope creep
- Inconsistent UI
- Poor mobile optimization
- Weak performance
- Overengineering

## Mitigation
- Strict V1 scope
- Mobile-first design
- Reusable component system
- Clean architecture
- Frequent testing

---

# 29. Final Development Principles

## Core Principles

### Ship Fast
Do not endlessly redesign.

### Focus on UX
A polished experience matters.

### Keep Features Focused
Avoid unnecessary complexity.

### Build for Real Users
Every feature should solve a real problem.

### Consistency Matters
Consistency creates premium feel.

### Mobile Experience Is Critical
Most students will heavily use mobile layouts.

---

# 30. Final Product Goal

Campus Core V1 should feel like:

“A beautiful and organized academic control center for college students.”

The app should make students feel:
- less overwhelmed
- more organized
- more in control of their academic life

---

# 31. Instructions for Coding Agent

## Mission
Build Campus Core V1 as a production-quality student productivity web application.

## Priority Order
1. Architecture stability
2. Mobile-first responsive UI
3. Clean UX
4. Reliable CRUD operations
5. Performance optimization
6. Visual polish

## Development Rules
- Follow strict folder organization.
- Build reusable components.
- Maintain consistent spacing and typography.
- Use clean TypeScript.
- Avoid unnecessary libraries.
- Keep components modular.
- Use Supabase securely.
- Prioritize mobile responsiveness.

## Important UI Rules
- No cluttered layouts.
- No inconsistent spacing.
- No low-contrast text.
- No overwhelming animations.
- No ugly forms.

## Expected Quality
The application should feel modern, polished, premium, and startup-quality.

It should not feel like a tutorial project.

---

# End of PRD

