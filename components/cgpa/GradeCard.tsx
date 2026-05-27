"use client";

import React, { useState } from "react";
import { Grade } from "@/types";
import { getGradePoints } from "@/utils/gpa";
import { MoreVertical, Trash2, Edit2, BookOpen, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GradeCardProps {
  grade: Grade;
  onEdit: (grade: Grade) => void;
  onDelete: (gradeId: string) => void;
}

export default function GradeCard({ grade, onEdit, onDelete }: GradeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const gp = getGradePoints(grade.grade);

  // Get dynamic colors based on the grade rank
  const getGradeStyle = (gradeStr: string) => {
    const g = gradeStr.toUpperCase();
    if (g === "O") {
      return {
        badge: "bg-primary/10 text-primary border-primary/30",
        pill: "bg-primary/5 text-primary border-primary/20",
        shadow: "shadow-primary/5",
      };
    }
    if (g === "A+" || g === "A") {
      return {
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        pill: "bg-emerald-500/5 text-emerald-400 border-emerald-500/20",
        shadow: "shadow-emerald-500/5",
      };
    }
    if (g === "B+" || g === "B") {
      return {
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        pill: "bg-amber-500/5 text-amber-400 border-amber-500/20",
        shadow: "shadow-amber-500/5",
      };
    }
    if (g === "C" || g === "P") {
      return {
        badge: "bg-neutral-500/10 text-neutral-300 border-neutral-500/30",
        pill: "bg-neutral-500/5 text-neutral-300 border-neutral-500/20",
        shadow: "shadow-neutral-500/5",
      };
    }
    // F or AB
    return {
      badge: "bg-destructive/10 text-destructive-foreground border-destructive/30",
      pill: "bg-destructive/5 text-destructive-foreground border-destructive/20",
      shadow: "shadow-destructive/5",
    };
  };

  const styles = getGradeStyle(grade.grade);

  return (
    <div className={`glass-card rounded-xl border border-border p-4 flex flex-col justify-between relative shadow-md hover:border-primary/20 transition-all text-left ${styles.shadow}`}>
      
      {/* Top section: Semester and Menu */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground bg-neutral-900/40 px-2 py-0.5 rounded border border-border/40">
          Semester {grade.semester}
        </span>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-md text-muted-foreground hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-1 w-32 bg-[#101014] border border-border rounded-lg shadow-xl z-45 py-1"
                >
                  <button
                    onClick={() => {
                      onEdit(grade);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 h-8 flex items-center gap-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Grade
                  </button>
                  <button
                    onClick={() => {
                      onDelete(grade.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 h-8 flex items-center gap-2 text-left text-xs text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Grade
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main details */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 pr-2">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase line-clamp-2">
            {grade.subject_name}
          </h4>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              {grade.credits} {grade.credits === 1 ? "Credit" : "Credits"}
            </span>
            <span className="text-neutral-700 text-[8px]">•</span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              {gp} {gp === 1 ? "Point" : "Points"}
            </span>
          </div>
        </div>

        {/* Dynamic Letter Grade Badge */}
        <div className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center font-extrabold shadow-sm shrink-0 ${styles.badge}`}>
          <span className="text-sm tracking-tight">{grade.grade}</span>
          <span className="text-[8px] font-semibold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{gp} GP</span>
        </div>
      </div>

    </div>
  );
}
