"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { gradeService } from "@/services/grade.service";
import { Grade } from "@/types";

const gradeSchema = z.object({
  semester: z
    .number()
    .int("Semester must be an integer")
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
  subjectName: z
    .string()
    .min(1, "Subject name is required")
    .max(100, "Subject name is too long"),
  credits: z
    .number()
    .int("Credits must be an integer")
    .min(1, "Credits must be at least 1")
    .max(10, "Credits cannot exceed 10"),
  grade: z.enum(["O", "A+", "A", "B+", "B", "C", "P", "F", "Ab"]),
});

type GradeFormValues = z.infer<typeof gradeSchema>;

interface AddGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newGrade: Grade) => void;
}

export default function AddGradeModal({
  isOpen,
  onClose,
  onSuccess,
}: AddGradeModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      semester: 1,
      subjectName: "",
      credits: 3,
      grade: "O",
    },
  });

  const onSubmit = async (values: GradeFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const newGrade = await gradeService.addGrade({
        semester: values.semester,
        subject_name: values.subjectName,
        credits: values.credits,
        grade: values.grade,
      });
      reset();
      onSuccess(newGrade);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to log grade card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const gradesList = ["O", "A+", "A", "B+", "B", "C", "P", "F", "Ab"];

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
            className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl relative z-10 overflow-hidden text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Log Subject Grade
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

              {/* Subject Name */}
              <div className="space-y-1.5">
                <label htmlFor="subjectName" className="text-xs font-semibold text-neutral-300">
                  Subject Name
                </label>
                <input
                  id="subjectName"
                  type="text"
                  placeholder="e.g. Artificial Intelligence"
                  disabled={isLoading}
                  autoFocus
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

              {/* Semester & Credits Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Semester */}
                <div className="space-y-1.5">
                  <label htmlFor="semester" className="text-xs font-semibold text-neutral-300">
                    Semester
                  </label>
                  <select
                    id="semester"
                    disabled={isLoading}
                    className="w-full h-11 px-3 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer"
                    {...register("semester", { valueAsNumber: true })}
                  >
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.semester.message}
                    </p>
                  )}
                </div>

                {/* Credits */}
                <div className="space-y-1.5">
                  <label htmlFor="credits" className="text-xs font-semibold text-neutral-300">
                    Course Credits
                  </label>
                  <input
                    id="credits"
                    type="number"
                    min={1}
                    max={10}
                    placeholder="e.g. 4"
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                    {...register("credits", { valueAsNumber: true })}
                  />
                  {errors.credits && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.credits.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Letter Grade */}
              <div className="space-y-1.5">
                <label htmlFor="grade" className="text-xs font-semibold text-neutral-300">
                  Obtained Letter Grade
                </label>
                <select
                  id="grade"
                  disabled={isLoading}
                  className="w-full h-11 px-3 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer"
                  {...register("grade")}
                >
                  {gradesList.map((g) => (
                    <option key={g} value={g}>
                      {g} ({g === "O" ? "Outstanding - 10 GP" : 
                           g === "A+" ? "Excellent - 9 GP" :
                           g === "A" ? "Very Good - 8 GP" :
                           g === "B+" ? "Good - 7 GP" :
                           g === "B" ? "Above Average - 6 GP" :
                           g === "C" ? "Average - 5 GP" :
                           g === "P" ? "Pass - 4 GP" :
                           g === "F" ? "Fail - 0 GP" : "Absent - 0 GP"})
                    </option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.grade.message}
                  </p>
                )}
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
                    <>Log Grade</>
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
