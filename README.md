<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<h1 align="center">🎓 Campus Core</h1>

<p align="center">
  <strong>The Student Operating System</strong><br/>
  <sub>A modern, premium workspace for college students to manage academics, attendance, assignments, schedules, and performance — all from one place.</sub>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-database-schema">Database</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🧠 Overview

Campus Core replaces scattered workflows involving WhatsApp groups, notes apps, calendar apps, manual attendance tracking, spreadsheet CGPA calculators, and messy college ERP systems — with a **lightning-fast, premium workspace** specifically tailored for college students.

### Product Philosophy

| | |
|---|---|
| ✨ **Minimal** | Clean interfaces, no clutter |
| 💎 **Premium** | Startup-quality design and interactions |
| 📐 **Organized** | Everything in the right place |
| ⚡ **Fast** | Instant loads, optimistic UI |
| 🔒 **Reliable** | Persistent sessions, row-level security |
| 📱 **Mobile-First** | Built for how students actually use apps |

---

## ✨ Features

### 📊 Attendance Tracker
Track total and attended classes per subject. Auto-calculate attendance percentages, safe-bunk counts, and receive visual warnings near the 75% danger zone.

- Add / Edit / Delete subjects
- One-tap attended & missed logging
- Safe bunk calculation (75% threshold)
- Visual circular progress gauges

### ✅ Assignment Tracker
Never miss a deadline. Manage coursework deliverables with priority tags, due dates, subject linking, and completion checkboxes.

- Priority tagging (High / Medium / Low)
- Due date tracking with overdue alerts
- Subject-linked assignments
- Optimistic completion toggles

### 🕐 Weekly Timetable
A clean, responsive weekly schedule. Desktop shows all 7 days in a grid board. Mobile uses a daily tab-switching timeline with room locations.

- 7-day desktop grid layout
- Mobile daily tab switcher
- Room & location info
- Today auto-highlighting

### 🏆 CGPA Calculator
Log semester grades with credit hours and letter grades. Get automatic SGPA per semester and cumulative CGPA on a 10-point Indian grading scale.

- Credit-weighted SGPA calculation
- Cumulative CGPA (O=10, A+=9, ...)
- Semester performance roadmap
- Earned vs attempted credits

### 🎯 Dashboard
A unified command center. See attendance health, CGPA progress, pending assignments, today's lectures, and a live 24-hour clock — all at a glance.

- Attendance, CGPA, coursework summary cards
- Today's lecture timeline
- Upcoming deliverables checklist
- Live 24h clock with date

### 🔐 Authentication
Secure email/password and Google OAuth login. Session persistence with Supabase Auth, protected routes, and automatic token refresh.

- Email & password signup/login
- Google OAuth integration
- Persistent sessions (tab-switch safe)
- Protected route middleware

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16** | App Router, Server & Client Components |
| **TypeScript** | Strict type-safety across the codebase |
| **Tailwind CSS v4** | Utility-first responsive styling |
| **Framer Motion** | Smooth micro-animations |
| **Zustand** | Lightweight global state management |
| **React Hook Form + Zod** | Validated form handling |

### Backend

| Technology | Purpose |
|---|---|
| **Supabase** | Auth, Database, Row Level Security |
| **PostgreSQL** | Relational data with UUID primary keys |
| **Supabase Auth** | JWT session tokens & OAuth providers |

### Tooling

| Tool | Purpose |
|---|---|
| **Git & GitHub** | Version control & collaboration |
| **ESLint** | Code quality enforcement |
| **Vercel** | Frontend deployment (planned) |

---

## 🏗 Architecture

Campus Core follows a **frontend-heavy architecture** using Supabase as the backend service. The frontend handles UI rendering, state management, client-side validation, and dashboard calculations. Supabase handles authentication, the PostgreSQL database, row-level security, and CRUD operations.

### Project Structure

```
campus-core/
├── app/                # Next.js App Router pages
│   ├── dashboard/      # Main dashboard
│   ├── attendance/     # Attendance tracker
│   ├── assignments/    # Assignment tracker
│   ├── timetable/      # Weekly timetable
│   ├── cgpa/           # CGPA calculator
│   ├── profile/        # User profile
│   ├── docs/           # V1 documentation page
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   └── forgot-password/# Password recovery
├── components/         # Reusable UI components
├── services/           # Supabase CRUD service modules
├── store/              # Zustand global state
├── lib/                # Supabase client config
├── types/              # TypeScript type definitions
├── utils/              # Calculation utilities (GPA, attendance)
├── supabase/           # Migration SQL files
└── public/             # Static assets
```

### Key Design Decisions

- **Dynamic calculations only** — Attendance %, SGPA, CGPA are never stored in the database; always computed client-side.
- **Session-cached auth** — Service modules use `getSession()` instead of `getUser()` to avoid redundant network round-trips.
- **Row Level Security** — Every table enforces user-scoped access via Supabase RLS policies.
- **Optimistic UI** — Assignment toggles and attendance logging update the UI instantly before server confirmation.

---

## 🗄 Database Schema

### `profiles`
```
id (UUID, PK) • full_name • college_name • course • semester • created_at
```

### `subjects`
```
id (UUID, PK) • user_id (FK) • subject_name • total_classes • attended_classes • created_at
```

### `assignments`
```
id (UUID, PK) • user_id (FK) • subject_id (FK) • title • description • due_date • priority • completed • created_at
```

### `timetable`
```
id (UUID, PK) • user_id (FK) • subject_id (FK) • day • start_time • end_time • room • created_at
```

### `grades`
```
id (UUID, PK) • user_id (FK) • semester • subject_name • credits • grade • created_at
```

### `exams`
```
id (UUID, PK) • user_id (FK) • subject_id (FK) • exam_type • exam_date • created_at
```

> [!IMPORTANT]
> Calculated values (attendance %, SGPA, CGPA) are **never stored** — always computed dynamically on the client.

---

## 🎨 Design System

### Inspiration
Visually inspired by **Linear**, **Notion**, **Vercel**, and **Raycast**.

### Color Palette

| Token | Dark Mode | Light Mode |
|---|---|---|
| Background | `#0a0a0c` | `#ffffff` |
| Card | `#101014` | `#f8f8fa` |
| Primary | `#3b82f6` | `#2563eb` |
| Border | `#222227` | `#e2e2e8` |

### Typography
- **Primary**: Geist Sans — clean geometric sans-serif
- **Monospace**: Geist Mono — for code and clock displays

### Themes
Ships with both **Dark Mode** (default) and **Light Mode**. Theme is persisted to `localStorage` and toggled from the sidebar.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- A **Supabase** project (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rkravikr/campus-core.git
cd campus-core

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL migrations in your Supabase SQL editor (files in `supabase/migrations/`), or apply them via the Supabase CLI:

```bash
npx supabase db push
```

### Development

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📐 Development Principles

| Principle | Description |
|---|---|
| **Ship Fast** | Build, ship, iterate. Don't endlessly redesign. |
| **Focus on UX** | A polished experience matters more than feature count. |
| **Keep Features Focused** | Every feature solves a real student problem. |
| **Mobile-First** | Most students use their phones. Design for mobile first. |
| **Consistency** | Consistent spacing, typography, and interactions create premium feel. |
| **Performance** | Fast initial loads, optimized rendering, lazy loading where needed. |

---

## 🗺 Roadmap

### V2 — AI & Intelligence
- [ ] AI study planner
- [ ] AI notes summarizer
- [ ] Smart attendance predictions
- [ ] Exam preparation assistant
- [ ] Notes uploads & file sharing
- [ ] Push notifications
- [ ] Calendar sync

### V3 — Community & Social
- [ ] Student communities
- [ ] Shared resources
- [ ] Public profiles
- [ ] Collaborative spaces
- [ ] College ecosystems
- [ ] Placement tracker

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/rkravikr">@rkravikr</a> — Campus Core V1</sub>
</p>
