"use client";

import React, { useState } from "react";
import { Subject } from "@/types";
import { calculateAttendanceStats } from "@/utils/attendance";
import { MoreVertical, Trash2, Edit2, MinusCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { attendanceService } from "@/services/attendance.service";

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
  onUpdate: (updatedSubject: Subject) => void;
}

export default function SubjectCard({
  subject,
  onEdit,
  onDelete,
  onUpdate,
}: SubjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isLogging, setIsLogging] = useState<"attended" | "missed" | "revert-attended" | "revert-missed" | null>(null);

  const stats = calculateAttendanceStats(
    subject.attended_classes,
    subject.total_classes
  );

  const handleLog = async (type: "attended" | "missed") => {
    setIsLogging(type);
    try {
      const updated = await attendanceService.logAttendance(subject.id, type);
      onUpdate(updated);
    } catch (err) {
      console.error("Failed to log attendance:", err);
    } finally {
      setIsLogging(null);
    }
  };

  const handleRevert = async (type: "attended" | "missed") => {
    setIsLogging(`revert-${type}`);
    try {
      const updated = await attendanceService.revertAttendance(subject.id, type);
      onUpdate(updated);
    } catch (err) {
      console.error("Failed to revert attendance:", err);
    } finally {
      setIsLogging(null);
    }
  };

  // Status colors mapping
  const statusColors = {
    Safe: {
      ring: "stroke-primary",
      bg: "bg-primary/10 text-primary",
      border: "border-primary/20",
    },
    Warning: {
      ring: "stroke-yellow-500",
      bg: "bg-yellow-500/10 text-yellow-500",
      border: "border-yellow-500/20",
    },
    Critical: {
      ring: "stroke-destructive",
      bg: "bg-destructive/10 text-destructive",
      border: "border-destructive/20",
    },
  };

  const activeColors = statusColors[stats.status] || statusColors.Safe;

  // SVG parameters for 56px circle ring
  const radius = 24;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="glass-card rounded-xl border border-border p-5 flex flex-col justify-between relative shadow-md overflow-hidden min-h-[220px]">
      
      {/* 1. TOP SECTION (Subject Name & Menu) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col text-left">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase line-clamp-1">
            {subject.subject_name}
          </h4>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase mt-0.5 tracking-wider">
            Lectures: {subject.attended_classes}/{subject.total_classes}
          </span>
        </div>
        
        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-md text-muted-foreground hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-1 w-32 bg-[#101014] border border-border rounded-lg shadow-xl z-40 py-1"
                >
                  <button
                    onClick={() => {
                      onEdit(subject);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 h-8 flex items-center gap-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Stats
                  </button>
                  <button
                    onClick={() => {
                      onDelete(subject.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 h-8 flex items-center gap-2 text-left text-xs text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Subject
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. CENTER SECTION (Safe Bunk Indicator & Gauge) */}
      <div className="my-4 flex items-center justify-between gap-4">
        {/* Warning / Notification text */}
        <div className="flex-1 text-left">
          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${activeColors.bg} ${activeColors.border} border mb-2`}>
            {stats.status}
          </div>
          <p className="text-xs text-neutral-300 leading-normal max-w-[190px]">
            {stats.message}
          </p>
        </div>

        {/* Circular Progress SVG Gauge */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              className="stroke-neutral-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Foreground progress circle */}
            <motion.circle
              cx="28"
              cy="28"
              r={radius}
              className={activeColors.ring}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          {/* Centered Percentage */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-white">
              {stats.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION (Action Buttons) */}
      <div className="space-y-2 pt-2 border-t border-border/40">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleLog("attended")}
            disabled={isLogging !== null}
            className="glow-btn flex items-center justify-center h-9 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary hover:text-white text-xs font-semibold transition-all"
          >
            {isLogging === "attended" ? "..." : "+ Attended"}
          </button>
          <button
            onClick={() => handleLog("missed")}
            disabled={isLogging !== null}
            className="flex items-center justify-center h-9 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/80 border border-border text-neutral-300 hover:text-white text-xs font-semibold transition-all"
          >
            {isLogging === "missed" ? "..." : "+ Missed"}
          </button>
        </div>
        
        {/* Revert Sub-actions */}
        {subject.total_classes > 0 && (
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
            <button
              onClick={() => handleRevert("attended")}
              disabled={isLogging !== null}
              className="hover:text-neutral-300 transition-colors flex items-center gap-1 py-0.5"
            >
              Revert Attended
            </button>
            <span className="w-1 h-1 rounded-full bg-neutral-800" />
            <button
              onClick={() => handleRevert("missed")}
              disabled={isLogging !== null}
              className="hover:text-neutral-300 transition-colors flex items-center gap-1 py-0.5"
            >
              Revert Missed
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
