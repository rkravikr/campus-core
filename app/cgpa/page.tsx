"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import GradeCard from "@/components/cgpa/GradeCard";
import AddGradeModal from "@/components/cgpa/AddGradeModal";
import EditGradeModal from "@/components/cgpa/EditGradeModal";
import { Grade } from "@/types";
import { gradeService } from "@/services/grade.service";
import { 
  calculateCGPA, 
  calculateSGPA, 
  calculateTotalAttemptedCredits, 
  calculateTotalEarnedCredits 
} from "@/utils/gpa";
import { 
  Plus, 
  Award, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  Loader2, 
  CheckCircle,
  Layers,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CGPAPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active filter tab
  const [activeSemFilter, setActiveSemFilter] = useState<number | "all">("all");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // Fetch grades
  const fetchGrades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await gradeService.getGrades();
      setGrades(data);
    } catch (err: any) {
      setError(err.message || "Failed to load grade records. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // Callbacks
  const handleAddSuccess = (newGrade: Grade) => {
    setGrades((prev) => [...prev, newGrade].sort((a, b) => a.semester - b.semester));
  };

  const handleEditClick = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsEditOpen(true);
  };

  const handleEditSuccess = (updatedGrade: Grade) => {
    setGrades((prev) =>
      prev.map((g) => (g.id === updatedGrade.id ? updatedGrade : g)).sort((a, b) => a.semester - b.semester)
    );
  };

  const handleDeleteClick = async (gradeId: string) => {
    if (!confirm("Are you sure you want to delete this grade record?")) return;
    try {
      await gradeService.deleteGrade(gradeId);
      setGrades((prev) => prev.filter((g) => g.id !== gradeId));
    } catch (err) {
      console.error("Failed to delete grade:", err);
      alert("Failed to delete grade record. Please try again.");
    }
  };

  // Calculations
  const cgpa = calculateCGPA(grades);
  const attemptedCredits = calculateTotalAttemptedCredits(grades);
  const earnedCredits = calculateTotalEarnedCredits(grades);
  const totalSubjectsCount = grades.length;

  // Filtered grades listing
  const filteredGrades = activeSemFilter === "all" 
    ? grades 
    : grades.filter((g) => g.semester === activeSemFilter);

  // Group semesters that have registered courses
  const semestersWithCourses = Array.from(new Set(grades.map((g) => g.semester))).sort();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Academics & CGPA
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track your credit hours, semester SGPAs, letter grades, and target CGPAs.
            </p>
          </div>
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="glow-btn inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold shadow-md shadow-primary/10 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Log Subject Grade
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state skeleton */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-card/20 rounded-xl border border-border animate-pulse" />
              ))}
            </div>
            <div className="h-14 w-full bg-card/20 rounded-xl border border-border animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-card/20 rounded-xl border border-border animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {grades.length === 0 ? (
              /* Overall Empty State */
              <div className="glass-card rounded-xl border border-border p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto mt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Academic Grades Logged</h3>
                <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
                  Start mapping your course timeline! Log your credits and letter grades to calculate automatic credit-weighted semester SGPAs and overall CGPA scores.
                </p>
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="glow-btn inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold shadow-md shadow-primary/10 transition-colors mt-6"
                >
                  <Plus className="w-4 h-4" />
                  Log Your First Grade
                </button>
              </div>
            ) : (
              <>
                {/* 1. Global Metrics Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* CGPA Display */}
                  <div className="glass-card rounded-xl border border-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl pointer-events-none" />
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                        Cumulative CGPA
                      </span>
                      <span className="text-3xl font-extrabold text-white mt-1 block">
                        {cgpa.toFixed(2)}
                      </span>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mt-1.5 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        10-Point scale
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Credits Earned vs Attempted */}
                  <div className="glass-card rounded-xl border border-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none" />
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                        Total Earned Credits
                      </span>
                      <span className="text-3xl font-extrabold text-white mt-1 block">
                        {earnedCredits} <span className="text-xs text-muted-foreground font-semibold">/ {attemptedCredits}</span>
                      </span>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mt-1.5 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {attemptedCredits - earnedCredits > 0 
                          ? `${attemptedCredits - earnedCredits} Credits Pending/Failed` 
                          : "100% Passed Credits"}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Completed Courses */}
                  <div className="glass-card rounded-xl border border-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl pointer-events-none" />
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                        Graded Courses
                      </span>
                      <span className="text-3xl font-extrabold text-white mt-1 block">
                        {totalSubjectsCount}
                      </span>
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block mt-1.5 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Across {semestersWithCourses.length} {semestersWithCourses.length === 1 ? "Semester" : "Semesters"}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* 2. Semester SGPAs Progress Board */}
                {semestersWithCourses.length > 0 && (
                  <div className="glass-card rounded-xl border border-border p-5 text-left">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                      Semester Performance Roadmap
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {semestersWithCourses.map((sem) => {
                        const semSgpa = calculateSGPA(grades, sem);
                        const semGrades = grades.filter((g) => g.semester === sem);
                        const semCredits = semGrades.reduce((acc, curr) => acc + curr.credits, 0);

                        return (
                          <button
                            key={sem}
                            onClick={() => setActiveSemFilter(sem)}
                            className={`p-3.5 rounded-lg border text-left transition-all ${
                              activeSemFilter === sem
                                ? "bg-primary/10 border-primary shadow-sm"
                                : "bg-card/25 border-border hover:border-neutral-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">
                                Sem {sem}
                              </span>
                              <span className="text-[9px] font-semibold text-muted-foreground">
                                {semCredits} Cr
                              </span>
                            </div>
                            
                            <div className="mt-2.5 flex items-baseline justify-between gap-2">
                              <span className="text-xl font-black text-white">
                                {semSgpa.toFixed(2)}
                              </span>
                              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">SGPA</span>
                            </div>

                            {/* Mini progress line indicator */}
                            <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden mt-2.5">
                              <div 
                                className="bg-primary h-full rounded-full transition-all duration-500" 
                                style={{ width: `${semSgpa * 10}%` }} 
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Filtering Toolbar */}
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x border-b border-border/40">
                    <button
                      onClick={() => setActiveSemFilter("all")}
                      className={`flex-none py-1.5 px-3.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                        activeSemFilter === "all"
                          ? "bg-primary border-primary text-white"
                          : "bg-card/40 border-border text-muted-foreground hover:text-white"
                      }`}
                    >
                      All Semesters
                    </button>
                    {semesters.map((sem) => (
                      <button
                        key={sem}
                        onClick={() => setActiveSemFilter(sem)}
                        className={`flex-none py-1.5 px-3.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          activeSemFilter === sem
                            ? "bg-primary border-primary text-white"
                            : "bg-card/40 border-border text-muted-foreground hover:text-white"
                        }`}
                      >
                        Semester {sem}
                      </button>
                    ))}
                  </div>

                  {/* Filtered course listings */}
                  {filteredGrades.length === 0 ? (
                    <div className="glass-card rounded-xl border border-border p-10 text-center flex flex-col items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-3">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-neutral-300 font-medium">No courses logged for Semester {activeSemFilter}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Tap "Log Subject Grade" at the top to add grade records.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredGrades.map((grade) => (
                        <GradeCard
                          key={grade.id}
                          grade={grade}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Modal dialog configurations */}
        <AddGradeModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleAddSuccess}
        />

        <EditGradeModal
          isOpen={isEditOpen}
          grade={selectedGrade}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedGrade(null);
          }}
          onSuccess={handleEditSuccess}
        />

      </div>
    </DashboardLayout>
  );
}
