"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Edit2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { attendanceService } from "@/services/attendance.service";
import { Subject } from "@/types";

// Validation schema
const editSubjectSchema = z
  .object({
    subjectName: z
      .string()
      .min(3, "Subject name must be at least 3 characters")
      .max(50, "Subject name cannot exceed 50 characters"),
    attendedClasses: z.number().min(0, "Attended classes cannot be negative"),
    totalClasses: z.number().min(0, "Total classes cannot be negative"),
  })
  .refine((data) => data.attendedClasses <= data.totalClasses, {
    message: "Attended classes cannot exceed total classes!",
    path: ["attendedClasses"],
  });

type EditSubjectFormValues = z.infer<typeof editSubjectSchema>;

interface EditSubjectModalProps {
  isOpen: boolean;
  subject: Subject | null;
  onClose: () => void;
  onSuccess: (updatedSubject: Subject) => void;
}

export default function EditSubjectModal({
  isOpen,
  subject,
  onClose,
  onSuccess,
}: EditSubjectModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditSubjectFormValues>({
    resolver: zodResolver(editSubjectSchema),
  });

  // Populate form values when subject is loaded
  useEffect(() => {
    if (subject) {
      setValue("subjectName", subject.subject_name);
      setValue("attendedClasses", subject.attended_classes);
      setValue("totalClasses", subject.total_classes);
    }
  }, [subject, setValue]);

  const onSubmit = async (values: EditSubjectFormValues) => {
    if (!subject) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedSubject = await attendanceService.updateSubject(subject.id, {
        subject_name: values.subjectName,
        attended_classes: values.attendedClasses,
        total_classes: values.totalClasses,
      });
      onSuccess(updatedSubject);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update subject. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && subject && (
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
                  Edit Subject Info
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
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Subject Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="subjectName"
                  className="text-xs font-semibold text-neutral-300"
                >
                  Subject Name
                </label>
                <input
                  id="subjectName"
                  type="text"
                  placeholder="e.g., Computer Networks"
                  disabled={isLoading}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                  {...register("subjectName")}
                />
                {errors.subjectName && (
                  <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.subjectName.message}
                  </p>
                )}
              </div>

              {/* Two Column Grid for Fractions */}
              <div className="grid grid-cols-2 gap-4">
                {/* Attended Classes */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="attendedClasses"
                    className="text-xs font-semibold text-neutral-300"
                  >
                    Attended Lectures
                  </label>
                  <input
                    id="attendedClasses"
                    type="number"
                    min="0"
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                    {...register("attendedClasses", { valueAsNumber: true })}
                  />
                  {errors.attendedClasses && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.attendedClasses.message}
                    </p>
                  )}
                </div>

                {/* Total Classes */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="totalClasses"
                    className="text-xs font-semibold text-neutral-300"
                  >
                    Total Lectures
                  </label>
                  <input
                    id="totalClasses"
                    type="number"
                    min="0"
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                    {...register("totalClasses", { valueAsNumber: true })}
                  />
                  {errors.totalClasses && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.totalClasses.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
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
