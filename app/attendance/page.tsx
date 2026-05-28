"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SubjectCard from "@/components/attendance/SubjectCard";
import AddSubjectModal from "@/components/attendance/AddSubjectModal";
import EditSubjectModal from "@/components/attendance/EditSubjectModal";
import { attendanceService } from "@/services/attendance.service";
import { Subject } from "@/types";
import { Plus, Percent, AlertCircle, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateAttendanceStats } from "@/utils/attendance";

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Fetch subjects
  const fetchSubjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getSubjects();
      setSubjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load subjects. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Aggregate Calculations
  const totalClassesCombined = subjects.reduce((sum, s) => sum + s.total_classes, 0);
  const attendedClassesCombined = subjects.reduce((sum, s) => sum + s.attended_classes, 0);
  const overallPercentage = totalClassesCombined > 0 
    ? Math.round((attendedClassesCombined / totalClassesCombined) * 100 * 10) / 10
    : 100;

  // Aggregate Status Details
  const getOverallStatus = () => {
    if (totalClassesCombined === 0) return { label: "Perfect", color: "text-primary border-primary/20 bg-primary/10" };
    if (overallPercentage >= 75) {
      const isClose = overallPercentage < 80;
      return {
        label: isClose ? "Warning Boundary" : "On Track",
        color: isClose ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" : "text-primary border-primary/20 bg-primary/10"
      };
    }
    return {
      label: "Attendance Shortage",
      color: "text-destructive border-destructive/20 bg-destructive/10"
    };
  };

  const statusInfo = getOverallStatus();

  // Callbacks
  const handleAddSuccess = (newSubject: Subject) => {
    setSubjects((prev) => [...prev, newSubject].sort((a, b) => a.subject_name.localeCompare(b.subject_name)));
  };

  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditOpen(true);
  };

  const handleEditSuccess = (updatedSubject: Subject) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
    );
  };

  const handleDeleteClick = async (subjectId: string) => {
    if (!confirm("Are you sure you want to delete this subject? This will delete all logged counts!")) return;
    try {
      await attendanceService.deleteSubject(subjectId);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    } catch (err) {
      console.error("Failed to delete subject:", err);
      alert("Failed to delete subject. Please try again.");
    }
  };

  const handleSubjectUpdate = (updatedSubject: Subject) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* 1. TOP HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              Attendance Control
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep your class averages safe and bunk lectures strategically.
            </p>
          </div>
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="glow-btn inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-[16px] bg-primary hover:bg-primary/95 text-white text-xs font-semibold shadow-md shadow-primary/10 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state skeleton panels */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-28 w-full bg-card/20 rounded-[20px] border border-border animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[220px] bg-card/20 rounded-[20px] border border-border animate-pulse" />
              ))}
            </div>
          </div>
        ) : subjects.length === 0 ? (
          
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[20px] border border-border p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-12"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              No Subjects Logged Yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Track your subject attendance and bunk capabilities. Click below to add your first college lecture!
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="glow-btn h-10 px-5 rounded-[16px] bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/10 transition-colors"
            >
              Add Your First Subject
            </button>
          </motion.div>
        ) : (
          
          /* Active Content */
          <>
            {/* Overall Summary Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[20px] border border-border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Overall Combined Average
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black text-white">{overallPercentage}%</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 text-left text-xs text-muted-foreground border-t sm:border-t-0 sm:border-l border-border/60 pt-4 sm:pt-0 sm:pl-8">
                <div>
                  <span className="block font-semibold uppercase tracking-wider text-[9px]">Lectures Attended</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{attendedClassesCombined} classes</span>
                </div>
                <div>
                  <span className="block font-semibold uppercase tracking-wider text-[9px]">Total Held</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{totalClassesCombined} classes</span>
                </div>
              </div>
            </motion.div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {subjects.map((sub) => (
                  <motion.div
                    key={sub.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SubjectCard
                      subject={sub}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                      onUpdate={handleSubjectUpdate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Modals Containers */}
        <AddSubjectModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleAddSuccess}
        />

        <EditSubjectModal
          isOpen={isEditOpen}
          subject={selectedSubject}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedSubject(null);
          }}
          onSuccess={handleEditSuccess}
        />
        
      </div>
    </DashboardLayout>
  );
}
