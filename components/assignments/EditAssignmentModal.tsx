"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Edit2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { assignmentService } from "@/services/assignment.service";
import { attendanceService } from "@/services/attendance.service";
import { Subject, Assignment } from "@/types";

const assignmentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title cannot exceed 80 characters"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Please select a valid due date and time"),
  priority: z.enum(["Low", "Medium", "High"]),
  subjectId: z.string().optional().nullable(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface EditAssignmentModalProps {
  isOpen: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSuccess: (updatedAssignment: any) => void;
}

export default function EditAssignmentModal({
  isOpen,
  assignment,
  onClose,
  onSuccess,
}: EditAssignmentModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
  });

  // Helper to format ISO date to YYYY-MM-DDTHH:MM
  const formatISODateToLocalInput = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  // Load active subjects and populate form inputs when assignment changes
  useEffect(() => {
    if (isOpen) {
      attendanceService.getSubjects()
        .then(setSubjects)
        .catch((err) => console.error("Failed to load subjects for dropdown:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (assignment) {
      setValue("title", assignment.title);
      setValue("description", assignment.description || "");
      setValue("dueDate", formatISODateToLocalInput(assignment.due_date));
      setValue("priority", assignment.priority);
      setValue("subjectId", assignment.subject_id || "");
    }
  }, [assignment, setValue]);

  const onSubmit = async (values: AssignmentFormValues) => {
    if (!assignment) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const updated = await assignmentService.updateAssignment(assignment.id, {
        subject_id: values.subjectId || null,
        title: values.title,
        description: values.description || null,
        due_date: new Date(values.dueDate).toISOString(),
        priority: values.priority,
      });
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update assignment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && assignment && (
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
            className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Edit Assignment
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-white p-1 rounded-md hover:bg-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Assignment Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="text-xs font-semibold text-neutral-300">
                  Task Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., CN Subnetting Lab"
                  disabled={isLoading}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs font-semibold text-neutral-300">
                  Description / Remarks
                </label>
                <textarea
                  id="description"
                  placeholder="Additional details, page numbers, or notes..."
                  disabled={isLoading}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors resize-none"
                  {...register("description")}
                />
              </div>

              {/* Link Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subjectId" className="text-xs font-semibold text-neutral-300">
                  Link Academic Subject (Optional)
                </label>
                <select
                  id="subjectId"
                  disabled={isLoading}
                  className="w-full h-11 px-3 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors text-white cursor-pointer"
                  {...register("subjectId")}
                >
                  <option value="">No Subject Linked</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subject_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid for Due Date & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Due Date */}
                <div className="space-y-1.5">
                  <label htmlFor="dueDate" className="text-xs font-semibold text-neutral-300">
                    Due Date & Time
                  </label>
                  <input
                    id="dueDate"
                    type="datetime-local"
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors text-white cursor-pointer"
                    {...register("dueDate")}
                  />
                  {errors.dueDate && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label htmlFor="priority" className="text-xs font-semibold text-neutral-300">
                    Priority Rating
                  </label>
                  <select
                    id="priority"
                    disabled={isLoading}
                    className="w-full h-11 px-3 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors text-white cursor-pointer"
                    {...register("priority")}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="h-10 px-4 rounded-lg border border-border hover:bg-neutral-900/40 text-neutral-300 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="glow-btn h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
