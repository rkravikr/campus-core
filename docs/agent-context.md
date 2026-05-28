```md
# Campus Core — Agent Context File

## File: /docs/agent-context.md

---

# Project Overview

Campus Core is a premium student productivity platform designed to help students manage:

- attendance
- assignments
- academic CGPA
- weekly timetable
- academic tracking
- student productivity workflows

The application is:

- mobile-first
- dark-theme focused
- productivity-oriented
- minimal
- modern SaaS inspired

This is NOT a generic college ERP.

The product should feel like:

- Linear
- Notion
- Arc Browser
- modern productivity dashboards

The focus is:

- speed
- clarity
- usability
- premium UI
- low cognitive load

---

# Product Philosophy

Campus Core must:

- reduce academic chaos
- reduce mental overload
- centralize student workflows
- feel calm and organized
- prioritize utility over gimmicks

Avoid:

- unnecessary features
- clutter
- over-animation
- excessive gradients
- childish UI patterns
- bloated dashboards

Every feature must solve a real student problem.

---

# Current Product Modules

## Existing Modules

### Dashboard

- overview cards
- attendance health
- academic progress
- coursework load
- lecture agenda
- upcoming tasks

### Attendance

- subject attendance tracking
- attended/missed counters
- attendance percentages
- bunk prediction system
- warning thresholds

### Assignments

- task management
- due dates
- priorities
- subject tagging
- status tracking

### Timetable

- weekly schedule
- lecture organization
- classroom management
- recurring schedule structure

### CGPA

- grade tracking
- semester GPA
- cumulative CGPA
- credits system

### Profile

- student identity
- academic info
- settings management

---

# Tech Stack

## Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Framer Motion (limited tasteful use)

## Backend

- Supabase

## Database

- PostgreSQL via Supabase

## Authentication

- Supabase Auth

## Hosting

- Vercel

---

# Design System Rules

# Global UI Direction

The UI must feel:

- premium
- minimal
- fast
- dark-mode native
- modern
- focused

Design language:

- smooth rounded cards
- soft borders
- subtle gradients
- restrained glow effects
- consistent spacing

Avoid:

- visual noise
- heavy glassmorphism
- random colors
- inconsistent spacing
- oversized components

---

# Color System

## Primary Accent

Blue accent system.

## Background

Deep dark blacks and dark navy tones.

## Text

- Primary → high contrast white
- Secondary → muted gray
- Tertiary → subtle muted text

## Status Colors

### Safe

Green

### Warning

Yellow/Amber

### Critical

Red

---

# Typography Rules

## Font Feel

Modern, clean, readable.

## Typography Hierarchy

### Desktop

- H1 → 40px
- H2 → 32px
- H3 → 24px
- Body → 15–16px
- Small → 13px

### Mobile

- H1 → 30px
- H2 → 24px
- H3 → 20px
- Body → 14–15px
- Small → 12px

Avoid:

- oversized text
- excessive uppercase
- inconsistent spacing

---

# Spacing System

Use consistent spacing scale only.

## Standard Spacing

- xs → 4px
- sm → 8px
- md → 16px
- lg → 24px
- xl → 32px
- 2xl → 48px

Avoid random spacing values.

---

# Radius System

## Standard Radius

- Cards → 20px
- Buttons → 16px
- Inputs → 14px

Maintain consistency.

---

# Motion Rules

Animations must feel:

- subtle
- smooth
- premium

## Allowed

- fade transitions
- smooth hover states
- scale microinteractions
- subtle glow transitions

## Avoid

- flashy motion
- bouncing everywhere
- distracting effects
- heavy parallax

## Animation Duration

150ms–250ms.

---

# Mobile-First Rules

The application is designed mobile-first.

All features MUST:

- work perfectly on mobile
- support one-handed usage
- avoid overflow
- maintain readable spacing
- maintain touch accessibility

---

# Mobile Navigation Rules

## Bottom Navigation

- fixed bottom nav
- touch friendly
- minimum 48px touch targets
- labels must NEVER overflow
- support active state animations

Prefer:

- short labels
- icons-only navigation

---

# Sidebar Rules (Desktop)

Sidebar should:

- remain compact
- support collapse mode
- maintain perfect icon alignment
- avoid excessive empty space

---

# Dashboard Rules

Dashboard should:

- prioritize important information
- minimize scrolling
- maintain clean hierarchy
- avoid oversized hero sections

Important metrics should appear above fold.

---

# Card Design Rules

All cards must:

- maintain consistent spacing
- maintain consistent radius
- avoid excessive height
- prioritize readable hierarchy

Cards should feel:

- lightweight
- structured
- dense but uncluttered

---

# Form Design Rules

Forms must:

- support keyboard accessibility
- avoid excessive spacing
- remain mobile-friendly
- provide loading states
- provide success feedback

---

# Empty State Rules

Empty states should:

- feel intentional
- feel encouraging
- contain personality
- guide users toward action

Avoid generic empty messages.

---

# Coding Rules

# General Engineering Rules

## DO NOT

- rewrite entire files unnecessarily
- refactor unrelated systems
- change working logic without reason
- introduce unnecessary dependencies
- over-engineer features

## ALWAYS

- preserve existing functionality
- use minimal diff updates
- maintain current architecture
- prioritize stability
- prioritize readability

---

# Component Rules

## Preferred Structure

- reusable components
- isolated logic
- small focused files

Avoid giant components.

---

# State Management Rules

Keep state:

- simple
- local where possible
- predictable

Avoid unnecessary global state.

---

# Performance Rules

## Prioritize

- fast rendering
- lightweight interactions
- optimized animations
- lazy loading where needed

Avoid:

- unnecessary rerenders
- heavy animation libraries
- large bundle additions

---

# API Rules

Supabase is the source of truth.

All CRUD operations must:

- support loading states
- support error handling
- maintain optimistic UI where possible

---

# Authentication Rules

Authentication must:

- persist sessions correctly
- work across refresh
- work across devices
- handle logout safely
- handle unauthorized redirects cleanly

---

# Database Rules

## Database Principles

- normalized structure
- clean naming
- scalable schema
- timestamp tracking

All records should support:

- created_at
- updated_at

---

# Error Handling Rules

Never silently fail.

Provide:

- toast feedback
- clear errors
- fallback states
- loading indicators

---

# Accessibility Rules

All UI must:

- support keyboard navigation
- maintain proper contrast
- support screen readability
- maintain accessible touch targets

---

# Responsive Rules

The application MUST:

- work on small mobile screens
- work on tablets
- work on desktop
- avoid overflow
- avoid clipped content
- avoid horizontal scrolling

---

# Product UX Direction

Campus Core should feel:

- focused
- reliable
- calming
- intelligent
- premium
- fast

Users should feel:

- academically organized
- less overwhelmed
- more in control

---

# Current Known Issues To Continuously Watch

- mobile responsiveness
- overflow issues
- excessive spacing
- navigation label truncation
- loading states
- mobile keyboard overlap
- dashboard density
- consistency across pages

---

# Future Features (Planned)

NOT all should be implemented immediately.

Future roadmap:

- attendance predictions
- AI academic assistant
- reminders
- productivity analytics
- installable PWA
- push notifications
- calendar integrations
- smart insights

---

# Important Development Rule

This project is now a real production application.

Prioritize:

1. stability
2. usability
3. responsiveness
4. polish
5. performance

DO NOT prioritize:

- gimmicks
- flashy redesigns
- unnecessary complexity

Every implementation decision should improve:

- clarity
- speed
- user experience
- maintainability

---

# Agent Workflow Instructions

When making changes:

1. Analyze existing implementation first.
2. Make minimal targeted changes.
3. Preserve current architecture.
4. Avoid breaking existing functionality.
5. Maintain design consistency.
6. Ensure mobile responsiveness.
7. Test edge cases mentally before implementation.

Always behave like a senior frontend/product engineer working on a production SaaS platform.
```
