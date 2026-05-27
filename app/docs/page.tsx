import {
  GraduationCap,
  BookOpen,
  Percent,
  CheckSquare,
  Clock,
  Award,
  Shield,
  Database,
  Layers,
  Palette,
  Smartphone,
  Zap,
  ArrowLeft,
  Sparkles,
  Code2,
  GitBranch,
  Rocket,
  Brain,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "V1 Documentation — Campus Core",
  description:
    "Complete documentation for Campus Core V1 — features, architecture, tech stack, database schema, and roadmap.",
};

export default function DocsPage() {
  const features = [
    {
      icon: Percent,
      title: "Attendance Tracker",
      description:
        "Track total and attended classes per subject. Auto-calculate attendance percentages, safe-bunk counts, and receive visual warnings when you approach the 75% danger zone.",
      highlights: [
        "Add / Edit / Delete subjects",
        "One-tap attended & missed logging",
        "Safe bunk calculation (75% threshold)",
        "Visual progress gauges",
      ],
    },
    {
      icon: CheckSquare,
      title: "Assignment Tracker",
      description:
        "Never miss a deadline again. Manage all coursework deliverables with priority tags, due dates, subject linking, and completion checkboxes.",
      highlights: [
        "Priority tagging (High / Medium / Low)",
        "Due date tracking with overdue alerts",
        "Subject-linked assignments",
        "Optimistic completion toggles",
      ],
    },
    {
      icon: Clock,
      title: "Weekly Timetable",
      description:
        "A clean, responsive weekly schedule. Desktop shows all 7 days in a grid board. Mobile uses a daily tab-switching timeline with room locations.",
      highlights: [
        "7-day desktop grid layout",
        "Mobile daily tab switcher",
        "Room & location info",
        "Today auto-highlighting",
      ],
    },
    {
      icon: Award,
      title: "CGPA Calculator",
      description:
        "Log semester grades with credit hours and letter grades. Get automatic SGPA per semester and cumulative CGPA on a 10-point Indian scale.",
      highlights: [
        "Credit-weighted SGPA calculation",
        "Cumulative CGPA (O=10, A+=9, ...)",
        "Semester performance roadmap",
        "Earned vs attempted credits",
      ],
    },
    {
      icon: Sparkles,
      title: "Dashboard",
      description:
        "A unified command center. See attendance health, CGPA progress, pending assignments, today's lectures, and a live 24-hour clock — all at a glance.",
      highlights: [
        "Attendance, CGPA, coursework summary cards",
        "Today's lecture timeline",
        "Upcoming deliverables checklist",
        "Live 24h clock with date",
      ],
    },
    {
      icon: Shield,
      title: "Authentication",
      description:
        "Secure email/password and Google OAuth login. Session persistence with Supabase Auth, protected routes, and automatic token refresh.",
      highlights: [
        "Email & password signup/login",
        "Google OAuth integration",
        "Persistent sessions (tab-switch safe)",
        "Protected route middleware",
      ],
    },
  ];

  const techStack = [
    {
      category: "Frontend",
      items: [
        { name: "Next.js 16", detail: "App Router, Server & Client Components" },
        { name: "TypeScript", detail: "Strict type-safety across the codebase" },
        { name: "Tailwind CSS v4", detail: "Utility-first responsive styling" },
        { name: "Framer Motion", detail: "Smooth micro-animations" },
        { name: "Zustand", detail: "Lightweight global state management" },
        { name: "React Hook Form + Zod", detail: "Validated form handling" },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Supabase", detail: "Auth, Database, Row Level Security" },
        { name: "PostgreSQL", detail: "Relational data with UUID primary keys" },
        { name: "Supabase Auth", detail: "JWT session tokens & OAuth providers" },
      ],
    },
    {
      category: "Tooling",
      items: [
        { name: "Git & GitHub", detail: "Version control & collaboration" },
        { name: "ESLint", detail: "Code quality enforcement" },
        { name: "Vercel", detail: "Frontend deployment (planned)" },
      ],
    },
  ];

  const dbTables = [
    {
      name: "profiles",
      columns: ["id (UUID, PK)", "full_name", "college_name", "course", "semester", "created_at"],
    },
    {
      name: "subjects",
      columns: ["id (UUID, PK)", "user_id (FK)", "subject_name", "total_classes", "attended_classes", "created_at"],
    },
    {
      name: "assignments",
      columns: ["id (UUID, PK)", "user_id (FK)", "subject_id (FK)", "title", "description", "due_date", "priority", "completed", "created_at"],
    },
    {
      name: "timetable",
      columns: ["id (UUID, PK)", "user_id (FK)", "subject_id (FK)", "day", "start_time", "end_time", "room", "created_at"],
    },
    {
      name: "grades",
      columns: ["id (UUID, PK)", "user_id (FK)", "semester", "subject_name", "credits", "grade", "created_at"],
    },
    {
      name: "exams",
      columns: ["id (UUID, PK)", "user_id (FK)", "subject_id (FK)", "exam_type", "exam_date", "created_at"],
    },
  ];

  const roadmap = [
    {
      version: "V2",
      items: [
        "AI study planner",
        "AI notes summarizer",
        "Smart attendance predictions",
        "Exam preparation assistant",
        "Notes uploads & file sharing",
        "Push notifications",
        "Calendar sync",
      ],
    },
    {
      version: "V3",
      items: [
        "Student communities",
        "Shared resources",
        "Public profiles",
        "Collaborative spaces",
        "College ecosystems",
        "Placement tracker",
      ],
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-12 px-4 md:px-6 overflow-hidden">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06)_0%,transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 mb-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-white transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-sm tracking-wider bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            CAMPUS<span className="text-primary">CORE</span>
          </span>
        </div>
      </header>

      {/* Page Title */}
      <div className="w-full max-w-4xl text-left z-10 mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
          <BookOpen className="w-3 h-3" />
          Documentation
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4">
          <span className="text-gradient">Campus Core</span>{" "}
          <span className="text-primary">V1 Docs</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Complete technical documentation for Campus Core V1 — the student
          operating system. Covers all feature modules, architecture decisions,
          database schema, design system, and the future roadmap.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="w-full max-w-4xl z-10 mb-16">
        <div className="glass-card rounded-xl border border-border p-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "Product Overview", href: "#overview" },
              { label: "Feature Modules", href: "#features" },
              { label: "Tech Stack", href: "#tech-stack" },
              { label: "Architecture", href: "#architecture" },
              { label: "Database Schema", href: "#database" },
              { label: "Design System", href: "#design" },
              { label: "Development Principles", href: "#principles" },
              { label: "Future Roadmap", href: "#roadmap" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-white hover:bg-card/40 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-primary" />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Product Overview */}
      <section id="overview" className="w-full max-w-4xl z-10 mb-16 scroll-mt-8">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Product Overview
        </h2>
        <div className="glass-card rounded-xl border border-border p-6 space-y-4 text-left">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Campus Core is a modern student operating system designed to help
            college students manage academics, attendance, assignments,
            schedules, and academic performance from one clean workspace.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            It replaces scattered workflows involving WhatsApp groups, notes
            apps, calendar apps, manual attendance tracking, spreadsheet CGPA
            calculators, and messy college ERP systems — with a fast, beautiful,
            mobile-first experience specifically tailored for college students.
          </p>
          <div className="pt-2 border-t border-border/40">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
              Product Philosophy
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Minimal", "Premium", "Organized", "Calm", "Fast", "Reliable", "Modern"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold text-primary px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Modules */}
      <section id="features" className="w-full max-w-4xl z-10 mb-16 scroll-mt-8">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          Feature Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card rounded-xl border border-border p-5 text-left space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-1.5">
                  {feature.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-[11px] text-muted-foreground flex items-start gap-2"
                    >
                      <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Tech Stack */}
      <section id="tech-stack" className="w-full max-w-4xl z-10 mb-16 scroll-mt-8">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Tech Stack
        </h2>
        <div className="space-y-4">
          {techStack.map((group) => (
            <div
              key={group.category}
              className="glass-card rounded-xl border border-border p-5 text-left"
            >
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                {group.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-lg bg-background/50 border border-border/60"
                  >
                    <span className="text-xs font-bold text-white block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Architecture */}
      <section id="architecture" className="w-full max-w-4xl z-10 mb-16 scroll-mt-8">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          Architecture
        </h2>
        <div className="glass-card rounded-xl border border-border p-6 text-left space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Campus Core follows a <span className="text-white font-semibold">frontend-heavy architecture</span> using
            Supabase as the backend service. The frontend handles UI rendering,
            state management, client-side validation, and dashboard calculations.
            Supabase handles authentication, the PostgreSQL database, row-level
            security, and CRUD operations.
          </p>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
              Project Structure
            </h3>
            <div className="bg-background/50 rounded-lg border border-border p-4 font-mono text-[11px] text-muted-foreground leading-relaxed">
              <pre>{`campus-core/
├── app/            # Next.js App Router pages
├── components/     # Reusable UI components
├── services/       # Supabase CRUD service modules
├── store/          # Zustand global state
├── lib/            # Supabase client config
├── types/          # TypeScript type definitions
├── utils/          # Calculation utilities (GPA, attendance)
├── supabase/       # Migration SQL files
└── public/         # Static assets`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
              Key Design Decisions
            </h3>
            <ul className="space-y-2">
              {[
                "Dynamic calculations only — attendance %, SGPA, CGPA are never stored in the database, always computed client-side.",
                "Session-cached auth — service modules use getSession() instead of getUser() to avoid redundant network round-trips.",
                "Row Level Security — every table enforces user-scoped access via Supabase RLS policies.",
                "Optimistic UI — assignment toggles and attendance logging update the UI instantly before server confirmation.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground flex items-start gap-2"
                >
                  <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Database Schema */}
      <section id="database" className="w-full max-w-4xl z-10 mb-16 scroll-mt-8">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Database Schema
        </h2>
        <div className="space-y-4">
          {dbTables.map((table) => (
            <div
              key={table.name}
              className="glass-card rounded-xl border border-border p-5 text-left"
            >
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                {table.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {table.columns.map((col) => (
                  <span
                    key={col}
                    className="text-[10px] font-mono font-semibold text-muted-foreground px-2.5 py-1 rounded bg-background/50 border border-border/60"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Design System */}
      <section id="design" className="w-full max-w-4xl z-10 mb-16 scroll-mt-8">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Design System
        </h2>
        <div className="glass-card rounded-xl border border-border p-6 text-left space-y-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
              Design Inspiration
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Linear", "Notion", "Vercel", "Raycast"].map((brand) => (
                <span
                  key={brand}
                  className="text-[10px] font-bold text-white px-3 py-1.5 rounded-lg bg-card border border-border"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
              Color Palette
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Background", value: "#0a0a0c", css: "bg-background" },
                { name: "Card", value: "#101014", css: "bg-card" },
                { name: "Primary", value: "#3b82f6", css: "bg-primary" },
                { name: "Border", value: "#222227", css: "bg-border" },
              ].map((color) => (
                <div key={color.name} className="text-center">
                  <div
                    className={`w-full h-12 rounded-lg border border-border/60 mb-2`}
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-[10px] font-bold text-white block">
                    {color.name}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {color.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
              Typography
            </h3>
            <p className="text-xs text-muted-foreground">
              Primary font: <span className="text-white font-semibold">Geist Sans</span> — clean geometric sans-serif designed for developer tools and productivity apps. Monospace elements use <span className="text-white font-semibold">Geist Mono</span>.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
              Themes
            </h3>
            <p className="text-xs text-muted-foreground">
              Campus Core ships with both <span className="text-white font-semibold">Dark Mode</span> (default) and <span className="text-white font-semibold">Light Mode</span>. Dark mode uses near-black backgrounds with electric blue accents. Light mode uses clean whites with full contrast overrides. Theme is persisted to localStorage and toggled from the sidebar.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Development Principles */}
      <section id="principles" className="w-full max-w-4xl z-10 mb-16 scroll-mt-8">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Development Principles
        </h2>
        <div className="glass-card rounded-xl border border-border p-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Ship Fast", desc: "Do not endlessly redesign. Build, ship, iterate." },
              { title: "Focus on UX", desc: "A polished experience matters more than feature count." },
              { title: "Keep Features Focused", desc: "Every feature solves a real student problem." },
              { title: "Mobile-First", desc: "Most students use their phones. Design for mobile first." },
              { title: "Consistency", desc: "Consistent spacing, typography, and interactions create premium feel." },
              { title: "Performance", desc: "Fast initial loads, optimized rendering, lazy loading where needed." },
            ].map((principle) => (
              <div
                key={principle.title}
                className="p-3 rounded-lg bg-background/50 border border-border/60"
              >
                <span className="text-xs font-bold text-white block mb-1">
                  {principle.title}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {principle.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Future Roadmap */}
      <section id="roadmap" className="w-full max-w-4xl z-10 mb-16 scroll-mt-8">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          Future Roadmap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.map((version) => (
            <div
              key={version.version}
              className="glass-card rounded-xl border border-border p-5 text-left"
            >
              <div className="flex items-center gap-2 mb-4">
                {version.version === "V2" ? (
                  <Brain className="w-4 h-4 text-primary" />
                ) : (
                  <Users className="w-4 h-4 text-primary" />
                )}
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {version.version} — {version.version === "V2" ? "AI & Intelligence" : "Community & Social"}
                </h3>
              </div>
              <ul className="space-y-2">
                {version.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="w-full max-w-4xl z-10 mb-8">
        <div className="glass-card rounded-xl border border-border p-8 text-center">
          <h2 className="text-lg font-extrabold text-white mb-2">
            Ready to get started?
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            Campus Core is free, open source, and built for students.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <button className="glow-btn flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold shadow-md shadow-primary/10 transition-all cursor-pointer">
                Open Dashboard
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <a
              href="https://github.com/rkravikr/campus-core"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg border border-border bg-card/40 hover:bg-card/75 text-foreground text-xs font-semibold transition-colors"
            >
              View on GitHub
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl border-t border-border/60 pt-6 mt-4 z-10 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Campus Core — V1 Documentation. Built with Next.js & Supabase.
        </p>
      </footer>
    </div>
  );
}
