"use client";

import React, { useState } from "react";
import { AssignmentWithSubject, assignmentService } from "@/services/assignment.service";
import { 
  Check, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  AlertTriangle,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AssignmentCardProps {
  assignment: AssignmentWithSubject;
  onEdit: (assignment: AssignmentWithSubject) => void;
  onDelete: (assignmentId: string) => void;
  onUpdate: (updated: AssignmentWithSubject) => void;
}

export default function AssignmentCard({
  assignment,
  onEdit,
  onDelete,
  onUpdate,
}: AssignmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Check if overdue
  const isOverdue = !assignment.completed && new Date(assignment.due_date) < new Date();

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const updated = await assignmentService.toggleAssignmentCompleted(
        assignment.id,
        !assignment.completed
      );
      onUpdate(updated);
    } catch (err) {
      console.error("Failed to toggle assignment:", err);
    } finally {
      setIsToggling(false);
    }
  };

  // Format date helper: returns "May 28 at 03:00 PM"
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Priority Styles mapping
  const priorityColors = {
    High: "bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Low: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <div className={`glass-card rounded-[20px] border p-4.5 flex flex-col justify-between transition-all relative overflow-hidden ${
      assignment.completed 
        ? "border-border/40 opacity-70 bg-card/20" 
        : isOverdue 
          ? "border-destructive/30 shadow-md shadow-destructive/5" 
          : assignment.priority === "High"
            ? "border-destructive/40 bg-destructive/5/10 shadow-[0_0_12px_rgba(239,68,68,0.02)]"
            : "border-border"
    }`}>
      
      {/* Top Section: Checkbox, Title & Menu */}
      <div className="flex items-start gap-3">
        {/* Customized Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`w-5 h-5 rounded-[8px] border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
            assignment.completed
              ? "bg-primary border-primary text-white"
              : isOverdue
                ? "border-destructive/50 hover:bg-destructive/5"
                : "border-neutral-700 hover:border-neutral-500 hover:bg-neutral-900"
          }`}
        >
          {assignment.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Text Details */}
        <div className="flex-1 text-left min-w-0">
          <h4 className={`text-sm font-bold text-white tracking-wide uppercase truncate ${
            assignment.completed ? "line-through text-muted-foreground font-normal" : ""
          } ${
            !assignment.completed && assignment.priority === "High" ? "text-destructive-foreground font-black" : ""
          }`}>
            {assignment.title}
          </h4>
          {assignment.description && (
            <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
              assignment.completed ? "text-muted-foreground/60" : "text-neutral-400"
            }`}>
              {assignment.description}
            </p>
          )}
        </div>

        {/* Action Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-[8px] text-muted-foreground hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
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
                  className="absolute right-0 mt-1 w-32 bg-[#101014] border border-border rounded-[12px] shadow-xl z-40 py-1"
                >
                  <button
                    onClick={() => {
                      onEdit(assignment);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 h-8 flex items-center gap-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Details
                  </button>
                  <button
                    onClick={() => {
                      onDelete(assignment.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 h-8 flex items-center gap-2 text-left text-xs text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Task
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Badges / Meta row */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/40">
        {/* Linked Subject Badge */}
        {assignment.subjects && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[12px] border border-border bg-neutral-900 text-muted-foreground text-[9px] font-bold uppercase tracking-wider">
            <BookOpen className="w-3 h-3 text-primary" />
            {assignment.subjects.subject_name}
          </span>
        )}

        {/* Priority Rating Badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[12px] border text-[9px] font-bold uppercase tracking-wider ${
          priorityColors[assignment.priority] || priorityColors.Medium
        }`}>
          {assignment.priority}
        </span>

        {/* Overdue Badge */}
        {isOverdue && (
          <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-[12px] border border-destructive/20 bg-destructive/10 text-destructive text-[9px] font-bold uppercase tracking-wider animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue
          </span>
        )}
      </div>

      {/* Due Date Indicator Bottom Section */}
      <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className={`w-3.5 h-3.5 ${isOverdue ? "text-destructive" : ""}`} />
          Due: <span className={`font-semibold ${
            assignment.completed 
              ? "text-muted-foreground" 
              : isOverdue 
                ? "text-destructive font-bold" 
                : "text-white"
          }`}>
            {formatDate(assignment.due_date)}
          </span>
        </span>
      </div>

    </div>
  );
}
