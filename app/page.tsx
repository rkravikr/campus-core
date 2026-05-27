import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  GraduationCap, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Percent, 
  Layers
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-6 overflow-hidden md:py-24">
      {/* Background Aesthetic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse" />
      
      {/* Header / Brand */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-wider bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            CAMPUS<span className="text-primary font-bold">CORE</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full border border-border bg-card/50">
            v1.0.0 Stable
          </span>
          <a
            href="https://github.com/rkravikr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors px-2.5 py-1 rounded-full border border-border bg-card/50 hover:bg-card/80"
            title="@rkravikr on GitHub"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <span className="hidden sm:inline font-medium">rkravikr</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-5xl flex flex-col items-center text-center mt-12 mb-16 z-10 md:mt-24 md:mb-24">
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          The Student Operating System
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl leading-[1.1] mb-6">
          <span className="text-gradient">Take Complete Control of Your</span>{" "}
          <span className="text-primary bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
            Academic Life.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed mb-8">
          Campus Core replaces cluttered spreadsheets, messy WhatsApp notifications, and outdated college ERPs with a lightning-fast, premium workspace tailored for students.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm mb-16">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="glow-btn w-full flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-primary hover:bg-primary/95 text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 cursor-pointer">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/docs" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-border bg-card/40 hover:bg-card/75 text-foreground font-medium transition-colors cursor-pointer">
              Read V1 Docs
            </button>
          </Link>
        </div>

        {/* Dashboard Preview / Showcase (Interactive Mockup feeling) */}
        <div className="w-full glass-card rounded-xl border border-border p-4 md:p-6 shadow-2xl relative">
          <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-primary text-[10px] text-white font-semibold uppercase tracking-wider">
            Live Preview
          </div>
          
          {/* Mock Dashboard Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Grid 1: Attendance Card */}
            <div className="p-4 rounded-lg bg-background/50 border border-border flex flex-col justify-between h-48">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Attendance Tracker
                </span>
                <Percent className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold">81.3%</span>
                  <span className="text-xs text-green-500 font-medium">Safe</span>
                </div>
                <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "81.3%" }} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                You can bunk <span className="text-white font-medium">3 more classes</span> of Computer Networks safely.
              </p>
            </div>

            {/* Grid 2: Today's Classes */}
            <div className="p-4 rounded-lg bg-background/50 border border-border flex flex-col justify-between h-48">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Today's Timetable
                </span>
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-2.5 my-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-medium text-white">Database Systems</span>
                  </div>
                  <span className="text-muted-foreground">09:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-medium text-white">Software Eng.</span>
                  </div>
                  <span className="text-muted-foreground">11:15 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                    <span className="font-medium text-muted-foreground line-through">CN Lab</span>
                  </div>
                  <span className="text-muted-foreground text-[10px] px-1 rounded bg-destructive/10 text-destructive">Bunked</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Next up: Room 304, Academic Block A
              </p>
            </div>

            {/* Grid 3: Upcoming Deliverables */}
            <div className="p-4 rounded-lg bg-background/50 border border-border flex flex-col justify-between h-48">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Upcoming Assignments
                </span>
                <CheckSquare className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded bg-card border border-border flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-medium text-white text-[11px] truncate max-w-[150px]">CN Subnetting Assignment</h4>
                    <span className="text-[10px] text-destructive font-medium">Due Tomorrow</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive uppercase font-semibold">
                    High
                  </span>
                </div>
                <div className="p-2 rounded bg-card border border-border flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-medium text-white text-[11px] truncate max-w-[150px]">DBMS Lab Report 6</h4>
                    <span className="text-[10px] text-muted-foreground">Due in 3 days</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 uppercase font-semibold">
                    Medium
                  </span>
                </div>
              </div>
              <div className="text-xs text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline">
                View all tasks
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Stats */}
      <footer className="w-full max-w-5xl border-t border-border/60 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Campus Core. Build stable, maintainable code.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Flame className="w-3.5 h-3.5 text-primary" />
            Designed for high productivity
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="w-3.5 h-3.5 text-primary" />
            Built with Next.js & Supabase
          </div>
        </div>
      </footer>
    </div>
  );
}
