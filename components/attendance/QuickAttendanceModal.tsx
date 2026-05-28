"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Percent, Plus, Minus, Check } from "lucide-react";
import { attendanceService } from "@/services/attendance.service";
import { Subject } from "@/types";

interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuickAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
}: QuickAttendanceModalProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const data = await attendanceService.getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects for quick attendance:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
    }
  }, [isOpen]);

  const handleAdjust = async (subject: Subject, type: "attended" | "total", amount: number) => {
    setIsSaving(true);
    try {
      const updatedAttended = Math.max(0, subject.attended_classes + (type === "attended" ? amount : 0));
      // Total classes should not be less than attended classes
      let updatedTotal = Math.max(0, subject.total_classes + amount);
      if (type === "attended" && updatedAttended > subject.total_classes) {
        updatedTotal = updatedAttended;
      }
      if (type === "total" && updatedTotal < subject.attended_classes) {
        updatedTotal = subject.attended_classes;
      }

      await attendanceService.updateSubject(subject.id, {
        attended_classes: updatedAttended,
        total_classes: updatedTotal,
      });

      // Update local state
      setSubjects(prev =>
        prev.map(s =>
          s.id === subject.id
            ? { ...s, attended_classes: updatedAttended, total_classes: updatedTotal }
            : s
        )
      );
    } catch (err) {
      console.error("Failed to update counter:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md bg-card border border-border rounded-[20px] shadow-2xl relative z-10 overflow-hidden text-left glass-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Percent className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Quick Attendance
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-white p-1 rounded-md hover:bg-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Body */}
            <div className="p-5 max-h-[350px] overflow-y-auto space-y-4 scrollbar-thin">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Syncing subjects...</span>
                </div>
              ) : subjects.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No subjects registered. Add subjects in the Timetable or Attendance dashboard first.
                </div>
              ) : (
                <div className="space-y-3">
                  {subjects.map((sub) => {
                    const percentage = sub.total_classes === 0 ? 100 : (sub.attended_classes / sub.total_classes) * 100;
                    
                    return (
                      <div key={sub.id} className="p-3 bg-neutral-950/40 rounded-xl border border-border/60 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white uppercase tracking-wide truncate block max-w-[150px]">
                            {sub.subject_name}
                          </span>
                          <span className="text-[9px] text-muted-foreground font-semibold mt-0.5 block uppercase tracking-wider">
                            Attended: {sub.attended_classes} / {sub.total_classes}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Percentage Tag */}
                          <span className={`text-[10px] font-black w-10 text-right ${
                            percentage >= 75 ? "text-primary" : "text-destructive"
                          }`}>
                            {percentage.toFixed(0)}%
                          </span>

                          {/* Increments controls */}
                          <div className="flex items-center bg-card border border-border rounded-lg p-0.5 gap-0.5">
                            <button
                              disabled={isSaving || sub.attended_classes === 0}
                              onClick={() => handleAdjust(sub, "attended", -1)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-neutral-900 text-muted-foreground hover:text-white transition-colors disabled:opacity-30"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={isSaving}
                              onClick={() => handleAdjust(sub, "attended", 1)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-neutral-900 text-muted-foreground hover:text-white transition-colors disabled:opacity-30"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-neutral-950 border-t border-border/40 flex justify-end">
              <button
                onClick={handleDone}
                disabled={isSaving}
                className="glow-btn h-10 px-5 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Done Updates
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
