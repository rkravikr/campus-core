# Campus Core — UI/UX Refinement & Product Polish PRD

## Version: V1 Polish Pass

## Status: Ready For Implementation

---

# Objective

Refine the current Campus Core application UI/UX for both desktop and mobile platforms.

The goal is **not** to redesign the product.

The goal is to:

* improve usability,
* improve spacing,
* improve responsiveness,
* improve visual hierarchy,
* improve interaction quality,
* improve mobile ergonomics,
* improve dashboard density,
* make the app feel premium and production-ready.

This document includes:

* desktop improvements,
* mobile improvements,
* typography improvements,
* layout improvements,
* navigation improvements,
* interaction improvements,
* accessibility improvements,
* product UX improvements.

---

# Global Design System Improvements

## Typography

### Current Issue

Typography feels slightly oversized in certain sections and lacks consistency across cards and layouts.

### Required Changes

#### Headings

* Reduce mobile page title sizes by approximately 8–10%
* Improve spacing consistency between headings and content
* Use tighter line-height for large headings

#### Subtitles

* Slightly reduce opacity
* Use smaller subtitle sizes on mobile
* Improve readability consistency across pages

#### Card Labels

* Reduce excessive uppercase usage
* Improve readability for long-term usage

#### Suggested Typography Scale

### Desktop

* H1 → 40px
* H2 → 32px
* H3 → 24px
* Body → 15–16px
* Small Text → 13px

### Mobile

* H1 → 30px
* H2 → 24px
* H3 → 20px
* Body → 14–15px
* Small Text → 12px

---

# Spacing System Improvements

## Current Issue

Several sections contain excessive vertical spacing, especially on mobile devices.

## Required Changes

### Reduce

* page top padding,
* hero section height,
* card internal padding,
* empty-state spacing,
* margins between stacked cards.

### Goal

Improve information density without making the interface feel cramped.

---

# Border Radius System

## Current Issue

Some cards and buttons feel overly rounded and visually oversized.

## Required Changes

Standardize radius values across:

* buttons,
* cards,
* modals,
* input fields.

### Recommended Radius Scale

* Cards → 20px
* Buttons → 16px
* Inputs → 14px

---

# Desktop Improvements

# Sidebar Improvements

## Current Issues

* Sidebar feels slightly oversized
* Excessive unused vertical space
* Bottom user section spacing feels awkward

## Required Changes

### Reduce Sidebar Width

Current sidebar width is larger than necessary.

### Improve Active State

Add:

* smoother active animations,
* subtle glow effects,
* left accent indicator bar.

### Improve Icon Alignment

Ensure all sidebar icons align perfectly vertically.

### Improve Bottom Section

* Compact the user profile area
* Reduce unnecessary padding
* Add hover feedback states

### Add Collapse Functionality

Allow sidebar collapse into icon-only mode.

---

# Dashboard Improvements (Desktop)

# Hero Section

## Current Issue

The hero section is visually appealing but occupies too much vertical space.

## Required Changes

### Reduce Height by Approximately 20%

Benefits:

* more content visible above the fold,
* improved dashboard density.

### Compress Chips

Reduce size of:

* semester chip,
* degree chip,
* docs button.

### Improve Date & Time Placement

The time block should feel more integrated into the layout.

---

# Dashboard Cards

## Required Changes

### Attendance Card

Current state:

* visually strong,
* slightly too spacious.

Add:

* bunk prediction,
* attendance trends,
* actionable insights.

Example:

> "You can miss 2 more classes safely."

### Academic Progress Card

Add:

* semester GPA,
* progress visualization,
* future support for mini trend charts.

### Coursework Load Card

Improve urgency visualization using:

* overdue glow,
* deadline indicators,
* color-coded urgency states.

---

# Assignment Page Improvements

## Current Issue

Assignment cards lack strong visual hierarchy.

## Required Changes

### Improve Priority Visibility

High-priority tasks should:

* stand out more clearly,
* use stronger contrast,
* include subtle red accents.

### Improve Filters

Desktop filters currently feel disconnected.

Convert them into:

* a unified toolbar,
* compact filter rows.

### Improve Task Density

Reduce excessive vertical padding between tasks.

---

# Attendance Page Improvements

## Current Issue

Attendance cards feel too text-heavy.

## Required Changes

### Prioritize Important Data

Prominently display:

* attendance percentage,
* bunks remaining,
* total classes.

### Reduce Repeated Warning Text

Replace repetitive warnings with:

* dynamic status labels,
* short contextual alerts.

### Improve Action Buttons

Buttons should:

* feel more tactile,
* provide stronger interaction feedback,
* include loading states.

---

# Timetable Improvements

## Current Issue

The timetable currently feels placeholder-like.

## Required Changes

### Convert to a Real Timetable Layout

Prepare a future-ready structure with:

* hourly blocks,
* vertical schedule views,
* calendar-inspired layouts.

### Improve Empty State

Current empty state feels static and lifeless.

### Add

* quick add button,
* class color tags,
* recurring schedule support.

---

# Profile Page Improvements

## Current Issue

The profile page feels overly form-heavy.

## Required Changes

### Separate Sections

Split into:

* Personal Info
* Academic Info
* Preferences
* Security

### Improve Card Hierarchy

The current profile summary card is visually strong.

Maintain this design consistency throughout the page.

---

# Mobile Improvements

# Mobile Navigation Bar

## Current Issue

Bottom navigation labels overflow or truncate.

## Required Changes

### Replace Labels

Current labels:

* ATTENDAN...
* ASSIGNME...

Use shorter labels such as:

* Attend
* Tasks
* Table

Or switch to:

* icons-only navigation.

### Improve Tap Targets

Minimum touch target size:

* 48px.

### Add Active Animations

Include:

* icon glow,
* subtle bounce,
* color transitions.

---

# Mobile Header Improvements

## Current Issue

Headers consume excessive vertical space.

## Required Changes

### Reduce

* title size,
* subtitle size,
* spacing below headers.

### Compact Action Buttons

Top-right theme and logout buttons feel oversized.

Reduce:

* padding,
* icon container size.

---

# Mobile Dashboard Improvements

## Current Issue

The hero card is too tall on mobile.

## Required Changes

### Reduce Hero Height

Reduce overall height by approximately 25%.

### Compact Chips

Reduce:

* chip padding,
* font size,
* spacing.

### Improve Dashboard Density

Users should be able to view:

* hero section,
* attendance card,
* academic progress card,

without excessive scrolling.

---

# Mobile Attendance Page Improvements

## Current Issue

Attendance cards are too tall.

## Required Changes

### Reduce

* internal spacing,
* warning text size,
* button height.

### Improve Circular Progress Alignment

Ensure perfect vertical centering.

### Improve Action Layout

Buttons should:

* feel less oversized,
* maintain equal widths.

---

# Mobile Assignment Improvements

## Current Issue

The filter toolbar consumes too much space.

## Required Changes

### Compress Filter Section

Use:

* smaller dropdowns,
* tighter spacing,
* compact tabs.

### Improve Card Hierarchy

Task titles should visually dominate the card.

### Improve Priority Indicators

High-priority tasks should stand out immediately.

---

# Mobile Timetable Improvements

## Required Changes

### Add Horizontal Day Scrolling

Current layout feels compressed.

### Improve Schedule Visualization

Use:

* timeline layouts,
* hourly blocks,
* subject color coding.

---

# Mobile Profile Improvements

## Current Issue

The form feels long and dense.

## Required Changes

### Split Form Sections

Use:

* accordions,
* grouped cards,
* collapsible sections.

### Improve Save Button Behavior

Add:

* sticky bottom action,
* loading state,
* success animation.

---

# Animations & Microinteractions

# Required Globally

## Add

* smooth page transitions,
* button press feedback,
* card hover animations,
* loading skeletons,
* fade transitions,
* optimistic updates.

---

# Motion Standards

## Animation Duration

* 150ms–250ms

## Easing

Use smooth ease-out curves.

## Avoid

* excessive motion,
* flashy animations,
* distracting effects.

---

# Empty State Improvements

## Current Issue

Empty states feel generic and lifeless.

## Required Changes

Add personality and contextual messaging.

### Examples

* "No lectures today. Academic peace achieved."
* "Nothing overdue. You're surviving college well."
* "No assignments yet. Enjoy the calm before chaos."

---

# Accessibility Improvements

# Required

## Ensure

* proper contrast ratios,
* keyboard navigation,
* visible focus states,
* touch-friendly sizing,
* readable text sizes,
* semantic HTML usage.

---

# Performance Improvements

# Required

## Optimize

* unnecessary rerenders,
* large animations,
* heavy shadows,
* image loading.

## Add

* lazy loading,
* skeleton loaders,
* optimistic updates.

---

# Future Product UX Features

# Not for Current Implementation

Only structure the application for future support.

## Planned Features

* attendance predictions,
* AI study assistant,
* reminder notifications,
* smart insights,
* weekly productivity summaries,
* installable PWA support,
* calendar sync,
* push notifications.

---

# Final Design Direction

Campus Core should feel:

* premium,
* minimal,
* student-focused,
* productivity-oriented,
* fast,
* intelligent,
* modern,
* clean.

Avoid:

* feature clutter,
* excessive gradients,
* heavy glassmorphism,
* over-animation,
* dashboard overload.

The application should prioritize:

* speed,
* clarity,
* usability,
* quick information access,
* low cognitive load.

---

# Implementation Priority Order

## Phase 1

* Mobile responsiveness fixes
* Navigation improvements
* Typography refinements
* Spacing adjustments

## Phase 2

* Dashboard density improvements
* Attendance UX refinement
* Assignment UX refinement

## Phase 3

* Timetable redesign
* Profile restructuring
* Empty state improvements

## Phase 4

* Animations
* Skeleton loaders
* Optimistic updates
* Motion polish

---

# Success Criteria

The application should:

* feel smooth on mobile,
* feel dense but uncluttered,
* feel installable like a native app,
* support one-handed usage,
* feel premium and modern,
* remain extremely fast.

The final experience should resemble:

* Linear,
* Notion,
* Arc,
* modern SaaS dashboards,

while remaining specifically optimized for student workflows.
