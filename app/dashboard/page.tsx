"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { attendanceService } from "@/services/attendance.service";
import { assignmentService, AssignmentWithSubject } from "@/services/assignment.service";
import { timetableService, TimetableEntryWithSubject } from "@/services/timetable.service";
import { gradeService } from "@/services/grade.service";
import { Subject, Grade, Weekday } from "@/types";
import { calculateCGPA, calculateTotalEarnedCredits } from "@/utils/gpa";
import { 
  Percent, 
  Award, 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { profile, user } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<AssignmentWithSubject[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntryWithSubject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live 24-hour clock states to prevent Next.js hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    setMounted(true);
    const updateDateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${hrs}:${mins}:${secs}`);

      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      );

      const hour = now.getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load all user tracker modules concurrently
  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [subsData, assignsData, timetableData, gradesData] = await Promise.all([
        attendanceService.getSubjects(),
        assignmentService.getAssignments(),
        timetableService.getTimetable(),
        gradeService.getGrades(),
      ]);

      setSubjects(subsData);
      setAssignments(assignsData);
      setTimetable(timetableData);
      setGrades(gradesData);
    } catch (err: any) {
      console.error("Dashboard parallel loading failed:", err);
      setError(err.message || "Failed to load dashboard data. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);



  const studentFirstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Student";

  // 2. Attendance health stats
  const totalHeld = subjects.reduce((acc, curr) => acc + curr.total_classes, 0);
  const totalAttended = subjects.reduce((acc, curr) => acc + curr.attended_classes, 0);
  const attendancePercentage = totalHeld === 0 ? 100 : (totalAttended / totalHeld) * 100;
  
  const getAttendanceStatus = (percent: number) => {
    if (percent >= 75) return { status: "Safe", color: "text-green-500 bg-green-500/10 border-green-500/20" };
    if (percent >= 70) return { status: "Warning", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    return { status: "Critical", color: "text-destructive bg-destructive/10 border-destructive/20" };
  };
  const attHealth = getAttendanceStatus(attendancePercentage);

  // 3. CGPA & credits
  const overallCgpa = calculateCGPA(grades);
  const earnedCredits = calculateTotalEarnedCredits(grades);

  // 4. Assignments counters & upcoming agenda list
  const pendingAssignments = assignments.filter((a) => !a.completed);
  const overdueCount = pendingAssignments.filter((a) => new Date(a.due_date) < new Date()).length;
  
  const upcomingAssignmentsList = pendingAssignments
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3);

  // Fast direct checklist toggle callback
  const handleToggleAssignment = async (assignId: string) => {
    // 1. Optimistic update
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignId ? { ...a, completed: true } : a))
    );
    try {
      await assignmentService.toggleAssignmentCompleted(assignId, true);
    } catch (err) {
      console.error("Direct assignment toggle failed:", err);
      // Revert if error
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignId ? { ...a, completed: false } : a))
      );
      alert("Failed to update task status. Please try again.");
    }
  };

  // 5. Today's Timetable lectures timeline
  const getTodayDayName = (): Weekday => {
    const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday... 6 is Saturday
    const weekdays: Weekday[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return todayIndex === 0 ? "Sunday" : weekdays[todayIndex - 1];
  };
  const todayDay = getTodayDayName();
  const todayLectures = timetable
    .filter((entry) => entry.day === todayDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Formats time clock strings
  const formatTime12h = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Dynamic Welcome Header Card */}
        <div className="glass-card rounded-2xl border border-border p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative overflow-hidden text-left min-h-[160px]">
          {/* Subtle Accent Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full filter blur-[50px] pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-32 h-32 bg-blue-500/5 rounded-full filter blur-[40px] pointer-events-none" />
          
          {/* Live Date, Day & 24h Time Widget */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 text-right flex flex-col items-end z-20">
            {mounted ? (
              <>
                <span className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  {dateStr}
                </span>
                <span className="text-xs md:text-sm font-mono font-extrabold text-primary tracking-wider mt-1 bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                  {timeStr}
                </span>
              </>
            ) : (
              <>
                <div className="w-24 h-3 bg-muted/20 rounded animate-pulse" />
                <div className="w-16 h-5 bg-muted/20 rounded animate-pulse mt-1" />
              </>
            )}
          </div>

          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Workspace Active
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {mounted ? greeting : "Welcome"}, <span className="bg-gradient-to-r from-white via-primary to-blue-400 bg-clip-text text-transparent">{studentFirstName}</span>!
            </h2>
            <p className="text-xs text-muted-foreground">
              Ready to coordinate your academic deliverables.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10 flex-wrap">
            <span className="text-[10px] text-muted-foreground px-3 py-1 rounded-full border border-border bg-card/60 font-semibold tracking-wider uppercase">
              {profile?.course || "Undergrad Program"}
            </span>
            <span className="text-[10px] text-primary px-3 py-1 rounded-full border border-primary/20 bg-primary/5 font-extrabold tracking-wider uppercase">
              Sem {profile?.semester || "1"}
            </span>
            <Link href="/docs" className="text-[10px] text-muted-foreground hover:text-primary px-3 py-1 rounded-full border border-border hover:border-primary/30 bg-card/60 hover:bg-primary/5 font-semibold tracking-wider uppercase transition-all">
              Read V1 Docs
            </Link>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-card/20 rounded-xl border border-border animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* 1. Fast Overview Analytics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Attendance Snap */}
              <Link href="/attendance" className="group">
                <div className="glass-card rounded-xl border border-border p-5 h-full flex flex-col justify-between hover:border-primary/20 transition-all text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Attendance Health
                    </span>
                    <Percent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">
                        {attendancePercentage.toFixed(1)}%
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${attHealth.color}`}>
                        {attHealth.status}
                      </span>
                    </div>
                    {/* Linear progress track */}
                    <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          attendancePercentage >= 75 ? "bg-primary" : "bg-destructive"
                        }`}
                        style={{ width: `${Math.min(100, attendancePercentage)}%` }} 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground group-hover:text-white transition-colors pt-1">
                    <span>Manage lectures</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* CGPA Snap */}
              <Link href="/cgpa" className="group">
                <div className="glass-card rounded-xl border border-border p-5 h-full flex flex-col justify-between hover:border-primary/20 transition-all text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Academic Progress
                    </span>
                    <Award className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">
                        {overallCgpa.toFixed(2)}
                      </span>
                      <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> CGPA
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                      Total earned credits: <span className="text-white font-bold">{earnedCredits} Credits</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground group-hover:text-white transition-colors pt-1">
                    <span>Grade card log</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Assignments Snap */}
              <Link href="/assignments" className="group">
                <div className="glass-card rounded-xl border border-border p-5 h-full flex flex-col justify-between hover:border-primary/20 transition-all text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Coursework Load
                    </span>
                    <CheckSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">
                        {pendingAssignments.length}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold">Pending tasks</span>
                    </div>
                    {overdueCount > 0 ? (
                      <span className="text-[9px] font-bold text-destructive px-1.5 py-0.5 rounded border border-destructive/20 bg-destructive/10 uppercase tracking-widest block w-max mt-2 flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        {overdueCount} Overdue Alert{overdueCount === 1 ? "" : "s"}
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest block w-max mt-2">
                        Zero Overdue Tasks
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground group-hover:text-white transition-colors pt-1">
                    <span>Coursework tracker</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>

            </div>

            {/* 2. Main Columns: Today's Timeline vs Deliverables Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              
              {/* Today's Lectures */}
              <div className="glass-card rounded-xl border border-border p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                      Today's Lecture Agenda ({todayLectures.length})
                    </h3>
                  </div>
                  <Link href="/timetable" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider flex items-center gap-0.5">
                    Timetable
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {todayLectures.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center h-[280px]">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-3 border border-border/40">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-neutral-300 font-bold uppercase tracking-wider">Free Workspace Today</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      No classes are scheduled on {todayDay}. Time for self study or relaxation!
                    </p>
                  </div>
                ) : (
                  <div className="relative border-l border-border pl-4 ml-3 py-1 space-y-5 h-[280px] overflow-y-auto scrollbar-thin">
                    {todayLectures.map((entry) => (
                      <div key={entry.id} className="relative group">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors shrink-0" />
                        
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-primary tracking-wider uppercase">
                              {formatTime12h(entry.start_time)} - {formatTime12h(entry.end_time)}
                            </span>
                            <h4 className="text-xs font-black text-white uppercase tracking-wide">
                              {entry.subjects?.subject_name}
                            </h4>
                          </div>

                          {entry.room && (
                            <span className="text-[9px] font-extrabold text-muted-foreground bg-neutral-900 border border-border/80 px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider shrink-0 mt-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {entry.room}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fast Deliverables Checklist */}
              <div className="glass-card rounded-xl border border-border p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                      Upcoming Checklist ({pendingAssignments.length})
                    </h3>
                  </div>
                  <Link href="/assignments" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider flex items-center gap-0.5">
                    View Tasks
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {upcomingAssignmentsList.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center h-[280px]">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-3 border border-border/40">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-neutral-300 font-bold uppercase tracking-wider">Zero Pending Tasks</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Congratulations! You have completed all assignments and reports.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 h-[280px] overflow-y-auto scrollbar-thin pr-1">
                    {upcomingAssignmentsList.map((task) => {
                      const isOverdue = new Date(task.due_date) < new Date();
                      
                      const priorityColor = 
                        task.priority === "High" ? "bg-destructive/10 text-destructive-foreground border-destructive/20" :
                        task.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-primary/10 text-primary border-primary/20";

                      return (
                        <div 
                          key={task.id} 
                          className="p-3 rounded-lg border border-border bg-card/15 flex items-center justify-between gap-3 hover:border-primary/10 transition-colors"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            {/* Optimistic Checkbox */}
                            <button
                              onClick={() => handleToggleAssignment(task.id)}
                              className="mt-0.5 w-4 h-4 rounded border border-border flex items-center justify-center text-primary bg-background hover:bg-primary/5 hover:border-primary transition-colors shrink-0"
                            >
                              <span className="w-1.5 h-1.5 bg-transparent rounded-sm" />
                            </button>
                            
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white uppercase tracking-wide truncate max-w-[170px] sm:max-w-[200px]">
                                {task.title}
                              </h4>
                              <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                                {task.subjects?.subject_name || "General"}
                              </p>
                              <span className={`text-[8px] font-extrabold uppercase tracking-widest mt-1 block ${
                                isOverdue ? "text-destructive" : "text-muted-foreground"
                              }`}>
                                Due: {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-widest ${priorityColor}`}>
                              {task.priority}
                            </span>
                            {isOverdue && (
                              <span className="text-[7px] font-extrabold text-destructive uppercase tracking-widest px-1.5 rounded bg-destructive/10 border border-destructive/20">
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}
