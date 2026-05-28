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
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isCollapsed, setIsCollapsed] = useState(false);

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
  
  const { user, profile, isLoading, session, initialize } = useAuthStore();

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
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("sb-")) {
          localStorage.removeItem(key);
        }
      }
      
      // 2. Clear Zustand store
      useAuthStore.getState().clearSession();
      
      // 3. Force hard redirect
      window.location.href = "/";
    }
  };

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Attendance", href: "/attendance", icon: Percent },
    { name: "Assignments", href: "/assignments", icon: CheckSquare },
    { name: "Timetable", href: "/timetable", icon: Clock },
    { name: "CGPA", href: "/cgpa", icon: GraduationCap },
    { name: "Profile", href: "/profile", icon: User },
  ];

  // Show premium loading splash screen while loading session
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
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
      <aside className={`hidden md:flex flex-col border-r border-border bg-card/45 backdrop-blur-xl h-screen sticky top-0 justify-between py-6 px-4 shrink-0 z-20 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}>
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className={`flex items-center gap-2.5 px-2 ${isCollapsed ? "justify-center px-0" : ""}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-black text-[1.3rem] tracking-wider bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
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
                  className={`flex items-center gap-3 px-3 h-10 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                    isCollapsed ? "justify-center px-0" : ""
                  } ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary font-extrabold"
                      : "text-muted-foreground hover:text-white hover:bg-neutral-900/40"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card, Collapse & Theme Controls */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          {/* User Details / Avatar */}
          <div className={`flex items-center justify-between gap-2 ${isCollapsed ? "flex-col items-center px-0" : "px-2"}`}>
            {!isCollapsed ? (
              <div className="flex flex-col text-left truncate max-w-[130px]">
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-card/85 backdrop-blur-lg flex items-center justify-evenly z-20 safe-bottom">
        {navItems.map((item) => {
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
              <span className="text-[8px] font-bold tracking-wide uppercase truncate max-w-[52px] text-center leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. CONTENT AREA */}
      <main className="flex-1 w-full flex flex-col min-h-[calc(100vh-3.5rem)] md:min-h-screen pb-20 md:pb-0">
        <div className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
