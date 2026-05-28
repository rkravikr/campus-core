"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { 
  GraduationCap, 
  Home, 
  Percent, 
  CheckSquare, 
  Clock, 
  User, 
  LogOut, 
  Loader2,
  Calendar,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  BookOpen,
  Command
} from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { motion, AnimatePresence } from "framer-motion";

// Quick Actions & Keyboard Palette imports
import CommandPalette from "@/components/CommandPalette";
import FloatingActions from "@/components/FloatingActions";
import AddAssignmentModal from "@/components/assignments/AddAssignmentModal";
import QuickAttendanceModal from "@/components/attendance/QuickAttendanceModal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Quick Action Portals Modals States
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isQuickAttendanceOpen, setIsQuickAttendanceOpen] = useState(false);

  // Semester dropdown switcher states
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
  const [isSwitchingSem, setIsSwitchingSem] = useState(false);

  // Mobile quick actions landscape menu open state
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);

  // Click outside to close the semester dropdown automatically
  useEffect(() => {
    if (!isSemDropdownOpen) return;
    const handleOutsideClick = () => {
      setIsSemDropdownOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isSemDropdownOpen]);

  // Click outside to close the mobile actions landscape menu automatically
  useEffect(() => {
    if (!isMobileActionsOpen) return;
    const handleOutsideClick = () => {
      setIsMobileActionsOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isMobileActionsOpen]);

  // Listen globally to Ctrl+K or Cmd+K to launch the Command Palette!
  useEffect(() => {
    const handleGlobalPalette = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalPalette);
    return () => window.removeEventListener("keydown", handleGlobalPalette);
  }, []);

  const handleQuickAction = (actionId: string) => {
    if (actionId === "command-menu") {
      setIsCommandOpen(true);
    } else if (actionId === "add-assignment") {
      setIsAddAssignmentOpen(true);
    } else if (actionId === "quick-attendance") {
      setIsQuickAttendanceOpen(true);
    }
  };

  const handleActionSuccess = () => {
    // Quick refresh of the current page data to sync UI instantly
    router.refresh();
    setTimeout(() => window.location.reload(), 300);
  };

  // Initialize theme and collapse from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const savedCollapse = localStorage.getItem("sidebar-collapsed") === "true";
    
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    }
    
    setIsCollapsed(savedCollapse);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const toggleCollapse = () => {
    const nextCollapse = !isCollapsed;
    setIsCollapsed(nextCollapse);
    localStorage.setItem("sidebar-collapsed", String(nextCollapse));
  };
  
  const { user, profile, isLoading, session, initialize, fetchProfile } = useAuthStore();

  const handleSemesterSwitch = async (selectedSem: number) => {
    if (!user || isSwitchingSem) return;
    setIsSwitchingSem(true);
    try {
      await authService.updateProfile(user.id, { semester: selectedSem });
      await fetchProfile(user.id);
    } catch (err) {
      console.error("Failed to update semester:", err);
    } finally {
      setIsSwitchingSem(false);
    }
  };

  // Initialize auth store listeners on layout mount
  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  // Handle redirect if not authenticated after loading completes
  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login");
    }
  }, [isLoading, session, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/25 animate-bounce">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest text-[#a1a1aa]">
            Loading Workspace...
          </span>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      // Force UI to clear even if Supabase API hangs (known bug on corrupted sessions)
      await Promise.race([
        authService.signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500))
      ]);
    } catch (err) {
      console.error("Logout API failed or timed out, but clearing local session anyway:", err);
    } finally {
      // 1. Manually blast all Supabase local storage keys to destroy the Auth Deadlock
      Object.keys(localStorage)
        .filter((key) => key.startsWith("sb-"))
        .forEach((key) => localStorage.removeItem(key));

      // 2. Blast all Supabase session cookies so server/middleware sees user as logged out
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name.startsWith("sb-")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      // 2. Clear Zustand store
      useAuthStore.getState().clearSession();
      
      // 3. Force hard redirect
      window.location.href = "/";
    }
  };

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home, mobileName: "Home" },
    { name: "Attendance", href: "/attendance", icon: Percent, mobileName: "Attend" },
    { name: "Assignments", href: "/assignments", icon: CheckSquare, mobileName: "Tasks" },
    { name: "Timetable", href: "/timetable", icon: Clock, mobileName: "Table" },
    { name: "CGPA", href: "/cgpa", icon: GraduationCap, mobileName: "CGPA" },
    { name: "Profile", href: "/profile", icon: User, mobileName: "Profile" },
  ];

  // Show premium loading splash screen while loading session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/25 animate-bounce">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest text-[#a1a1aa]">
            Loading Workspace...
          </span>
        </div>
      </div>
    );
  }

  // Double safety guard
  if (!session) return null;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col md:flex-row relative">
      
      {/* 1. DESKTOP SIDEBAR (Visible on md and above) */}
      <aside className={`hidden md:flex flex-col border-r border-border bg-card/45 backdrop-blur-xl h-screen fixed left-0 top-0 bottom-0 justify-between py-6 px-4 shrink-0 z-20 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[240px]"
      }`}>
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className={`flex items-center gap-2.5 px-2 ${isCollapsed ? "justify-center px-0" : ""}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-black text-[1.2rem] tracking-wider bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                CAMPUS<span className="text-primary">CORE</span>
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold transition-all relative ${
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                      : "text-muted-foreground hover:bg-neutral-900/30 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                  {isActive && (
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-primary rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Academic Program / Workspace Switcher section in the middle of sidebar */}
          {!isCollapsed ? (
            <div className="px-2 pt-4 border-t border-border/20">
              <span className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest block mb-2 px-1">
                Academic Program
              </span>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-border/80 bg-[#101014]/60 hover:bg-neutral-900/80 text-[12px] font-bold text-white cursor-pointer transition-all select-none group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-neutral-200">Semester {profile?.semester || 1}</span>
                  </div>
                  {isSwitchingSem ? (
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white transition-colors" />
                  )}
                </button>

                <AnimatePresence>
                  {isSemDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-0 right-0 mt-1.5 w-full glass-panel rounded-xl border border-border bg-[#0f0f12] p-1 shadow-2xl z-40 overflow-hidden"
                    >
                      <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground px-2.5 py-1.5 border-b border-border/40 select-none">
                        Switch Semester
                      </div>
                      <div className="max-h-40 overflow-y-auto py-1 space-y-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                          const isActive = (profile?.semester || 1) === sem;
                          return (
                            <button
                              key={sem}
                              type="button"
                              onClick={() => {
                                handleSemesterSwitch(sem);
                                setIsSemDropdownOpen(false);
                              }}
                              className={`w-full text-left h-8 px-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-neutral-900/50 hover:text-white"
                              }`}
                            >
                              <span>Semester {sem}</span>
                              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-border/20 flex justify-center">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)}
                  className="w-9 h-9 rounded-xl border border-border bg-[#101014]/60 hover:bg-neutral-900/80 flex items-center justify-center text-primary cursor-pointer transition-all select-none group"
                  title={`Semester ${profile?.semester || 1} - Click to switch`}
                >
                  {isSwitchingSem ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <span className="text-[11px] font-black text-primary group-hover:scale-105 transition-transform">
                      S{profile?.semester || 1}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isSemDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-11 top-0 w-32 glass-panel rounded-xl border border-border bg-[#0f0f12] p-1 shadow-2xl z-40 overflow-hidden"
                    >
                      <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1 border-b border-border/40 select-none">
                        Semester
                      </div>
                      <div className="max-h-40 overflow-y-auto py-1 space-y-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                          const isActive = (profile?.semester || 1) === sem;
                          return (
                            <button
                              key={sem}
                              type="button"
                              onClick={() => {
                                handleSemesterSwitch(sem);
                                setIsSemDropdownOpen(false);
                              }}
                              className={`w-full text-left h-7 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-neutral-900/50 hover:text-white"
                              }`}
                            >
                              <span>Sem {sem}</span>
                              {isActive && <span className="w-1 h-1 rounded-full bg-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* User Card, Collapse & Theme Controls */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          {/* User Details / Avatar */}
          <div className={`flex items-center justify-between gap-2 ${isCollapsed ? "flex-col items-center px-0" : "px-2"}`}>
            {!isCollapsed ? (
              <div className="flex flex-col text-left truncate max-w-[110px]">
                <span className="text-xs font-bold text-white truncate">
                  {profile?.full_name || user?.email?.split("@")[0] || "Student"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {profile?.college_name || "College Student"}
                </span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0 cursor-default" title={profile?.full_name || "Student"}>
                {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "S"}
              </div>
            )}

            {/* Quick Action Controls */}
            <div className={`flex items-center gap-1.5 ${isCollapsed ? "flex-col mt-2" : ""}`}>
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-border bg-[#101014]/60 hover:bg-neutral-900 text-muted-foreground hover:text-white transition-all cursor-pointer"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {/* Log Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 rounded-lg border border-border bg-[#101014]/60 hover:border-destructive hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sidebar Collapse Toggle trigger */}
          <div className="pt-2 border-t border-border/20 flex justify-center">
            <button
              onClick={toggleCollapse}
              className="w-full py-1.5 rounded-lg border border-border/40 hover:border-border hover:bg-neutral-900/30 text-muted-foreground hover:text-white transition-all flex items-center justify-center cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION (Visible on mobile only) */}
      <div className="md:hidden w-full flex items-center justify-between h-14 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-lg z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-[1.3rem] tracking-wider bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            CAMPUS<span className="text-primary">CORE</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile Semester Selector Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-background/50 text-[10px] font-black uppercase tracking-wider text-primary cursor-pointer active:bg-neutral-800 select-none"
            >
              {isSwitchingSem ? (
                <Loader2 className="w-3 h-3 text-primary animate-spin" />
              ) : (
                `Sem ${profile?.semester || 1}`
              )}
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <AnimatePresence>
              {isSemDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-1.5 w-36 glass-panel rounded-xl border border-border bg-[#0f0f12] p-1 shadow-2xl z-40 overflow-hidden"
                >
                  <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1 border-b border-border/40 select-none">
                    Select Semester
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1 space-y-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                      const isActive = (profile?.semester || 1) === sem;
                      return (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => handleSemesterSwitch(sem)}
                          className={`w-full text-left h-7 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-neutral-900/50 hover:text-white"
                          }`}
                        >
                          <span>Semester {sem}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border bg-background/50 text-muted-foreground hover:text-white transition-all active:bg-neutral-800"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            type="button"
            onClick={handleSignOut}
            className="p-2 rounded-lg border border-border bg-background/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all active:bg-destructive/20"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar with Center Elevated Quick Actions trigger */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-card/85 backdrop-blur-lg flex items-center justify-evenly z-20 safe-bottom">
        {/* Left half: Home, Attend, Tasks */}
        {navItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full gap-0.5 min-w-0 px-1 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="text-[8px] font-bold tracking-wide uppercase truncate max-w-[52px] text-center leading-tight">{(item as any).mobileName || item.name}</span>
            </Link>
          );
        })}

        {/* Center elevated button trigger */}
        <div className="relative -mt-6" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsMobileActionsOpen(!isMobileActionsOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 border border-primary/20 cursor-pointer transition-all duration-300 outline-none ${
              isMobileActionsOpen 
                ? "bg-destructive rotate-45 border-destructive/20 shadow-destructive/25" 
                : "bg-gradient-to-tr from-primary to-blue-400 active:scale-95"
            }`}
            title="Quick Action Menu"
          >
            <Plus className="w-5 h-5 font-black" />
          </button>

          {/* Mobile Landscape Quick Actions Panel Overlay */}
          <AnimatePresence>
            {isMobileActionsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95, x: "-50%" }}
                animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                exit={{ opacity: 0, y: 15, scale: 0.95, x: "-50%" }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-20 left-1/2 z-30 glass-panel rounded-[20px] border border-border bg-[#0f0f12]/95 p-3 flex items-center justify-center gap-5 shadow-2xl shrink-0 select-none w-[240px]"
              >
                {[
                  { id: "quick-attendance", label: "Attend", icon: Percent, color: "bg-blue-500 hover:bg-blue-400" },
                  { id: "add-assignment", label: "Task", icon: BookOpen, color: "bg-emerald-500 hover:bg-emerald-400" },
                  { id: "command-menu", label: "Menu", icon: Command, color: "bg-purple-600 hover:bg-purple-500" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleQuickAction(item.id);
                        setIsMobileActionsOpen(false);
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer outline-none group"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${item.color} border border-white/10 shadow-md active:scale-95 transition-all shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest leading-none mt-1">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right half: Table, CGPA, Profile */}
        {navItems.slice(3).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full gap-0.5 min-w-0 px-1 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="text-[8px] font-bold tracking-wide uppercase truncate max-w-[52px] text-center leading-tight">{(item as any).mobileName || item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. CONTENT AREA */}
      <main className={`flex-1 w-full flex flex-col min-h-[calc(100vh-3.5rem)] md:min-h-screen pb-20 md:pb-0 transition-all duration-300 ${
        isCollapsed ? "md:pl-[72px]" : "md:pl-[240px]"
      }`}>
        <div className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full transition-all duration-300">
          {children}
        </div>
      </main>

      {/* Floating Speed-Dial Button & Palette overlays */}
      <FloatingActions onTrigger={handleQuickAction} />

      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onQuickAction={handleQuickAction} 
      />

      <AddAssignmentModal 
        isOpen={isAddAssignmentOpen} 
        onClose={() => setIsAddAssignmentOpen(false)} 
        onSuccess={handleActionSuccess} 
      />

      <QuickAttendanceModal 
        isOpen={isQuickAttendanceOpen} 
        onClose={() => setIsQuickAttendanceOpen(false)} 
        onSuccess={handleActionSuccess} 
      />
    </div>
  );
}
