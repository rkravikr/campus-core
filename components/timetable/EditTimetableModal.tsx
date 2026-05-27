"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Edit2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { timetableService } from "@/services/timetable.service";
import { attendanceService } from "@/services/attendance.service";
import { Subject, Weekday, TimetableEntry } from "@/types";

// Validation schema
const timetableSchema = z
  .object({
    day: z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
    subjectId: z.string().min(1, "Please link an academic subject"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    room: z.string().optional().nullable(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must occur before end time!",
    path: ["startTime"],
  });

type TimetableFormValues = z.infer<typeof timetableSchema>;

interface EditTimetableModalProps {
  isOpen: boolean;
  entry: TimetableEntry | null;
  onClose: () => void;
  onSuccess: (updatedEntry: any) => void;
}

export default function EditTimetableModal({
  isOpen,
  entry,
  onClose,
  onSuccess,
}: EditTimetableModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableSchema),
  });

  // Load subjects
  useEffect(() => {
    if (isOpen) {
      attendanceService.getSubjects()
        .then(setSubjects)
        .catch((err) => console.error("Failed to load subjects for dropdown:", err));
    }
  }, [isOpen]);

  // Format time helper (removes seconds e.g. "09:00:00" -> "09:00")
  const formatTimeInput = (timeStr: string) => {
    if (!timeStr) return "";
    return timeStr.slice(0, 5);
  };

  // Populate values when entry is selected
  useEffect(() => {
    if (entry) {
      setValue("day", entry.day);
      setValue("subjectId", entry.subject_id || "");
      setValue("startTime", formatTimeInput(entry.start_time));
      setValue("endTime", formatTimeInput(entry.end_time));
      setValue("room", entry.room || "");
    }
  }, [entry, setValue]);

  const onSubmit = async (values: TimetableFormValues) => {
    if (!entry) return;

    setIsLoading(true);
    setError(null);
    try {
      const updated = await timetableService.updateTimetableEntry(entry.id, {
        subject_id: values.subjectId,
        day: values.day,
        start_time: values.startTime,
        end_time: values.endTime,
        room: values.room || null,
      });
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update class details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const days: Weekday[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <AnimatePresence>
      {isOpen && entry && (
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
                  Edit Class Info
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

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subjectId" className="text-xs font-semibold text-neutral-300">
                  Link Subject
                </label>
                <select
                  id="subjectId"
                  disabled={isLoading}
                  className="w-full h-11 px-3 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer"
                  {...register("subjectId")}
                >
                  <option value="">Select Linked Subject...</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subject_name}
                    </option>
                  ))}
                </select>
                {errors.subjectId && (
                  <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.subjectId.message}
                  </p>
                )}
              </div>

              {/* Weekday & Classroom Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Day Select */}
                <div className="space-y-1.5">
                  <label htmlFor="day" className="text-xs font-semibold text-neutral-300">
                    Day of the Week
                  </label>
                  <select
                    id="day"
                    disabled={isLoading}
                    className="w-full h-11 px-3 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer"
                    {...register("day")}
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div className="space-y-1.5">
                  <label htmlFor="room" className="text-xs font-semibold text-neutral-300">
                    Room / Location
                  </label>
                  <input
                    id="room"
                    type="text"
                    placeholder="e.g., Room 304"
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                    {...register("room")}
                  />
                </div>
              </div>

              {/* Grid for Times */}
              <div className="grid grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="space-y-1.5">
                  <label htmlFor="startTime" className="text-xs font-semibold text-neutral-300">
                    Start Time
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer"
                    {...register("startTime")}
                  />
                  {errors.startTime && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div className="space-y-1.5">
                  <label htmlFor="endTime" className="text-xs font-semibold text-neutral-300">
                    End Time
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer"
                    {...register("endTime")}
                  />
                  {errors.endTime && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.endTime.message}
                    </p>
                  )}
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
