"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, 
  Building2, 
  BookOpen, 
  Hash, 
  Mail, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Settings,
  ShieldAlert,
  Save,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Schema matching database limits
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  collegeName: z.string().min(3, "College name must be at least 3 characters"),
  course: z.string().min(2, "Course / Degree must be at least 2 characters"),
  semester: z
    .number()
    .int()
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, profile, fetchProfile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Prepopulate form when profile changes
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name || "",
        collegeName: profile.college_name || "",
        course: profile.course || "",
        semester: profile.semester || 1,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      // 1. Update database
      await authService.updateProfile(user.id, {
        full_name: values.fullName,
        college_name: values.collegeName,
        course: values.course,
        semester: values.semester,
      });

      // 2. Refetch profile in Zustand store for real-time app sync
      await fetchProfile(user.id);
      
      setSuccessMsg("Your student profile has been updated successfully!");
      setIsSavedRecently(true);
      
      // Auto dismiss success states
      setTimeout(() => {
        setSuccessMsg(null);
        setIsSavedRecently(false);
      }, 4000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        
        {/* Header */}
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Student Settings
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Customize your academic program and account identity.
          </p>
        </div>

        {/* Dynamic Alerts */}
        <AnimatePresence mode="wait">
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2.5 p-3.5 rounded-[14px] border border-green-500/20 bg-green-500/10 text-xs text-green-400 text-left"
            >
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2.5 p-3.5 rounded-[14px] border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground text-left"
            >
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Double column details layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Visual Profile Card Badge */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-[20px] border border-border p-6 flex flex-col items-center justify-between text-center relative overflow-hidden h-max sticky top-6">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl pointer-events-none" />
              
              {/* Round Avatar Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary/20 mb-4">
                {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "S"}
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {profile?.full_name || "Active Student"}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">
                {profile?.college_name || "College Student"}
              </p>

              <div className="w-full border-t border-border/40 mt-5 pt-4 space-y-3 text-left">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground uppercase font-bold tracking-wider">Course:</span>
                  <span className="text-white font-semibold truncate max-w-[150px]">{profile?.course || "Engineering"}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground uppercase font-bold tracking-wider">Semester:</span>
                  <span className="text-primary font-black uppercase">Sem {profile?.semester || "1"}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground uppercase font-bold tracking-wider">Registered:</span>
                  <span className="text-neutral-400 font-semibold">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form edit Panel */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Card 1: Personal Identity */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-[20px] border border-border p-6 space-y-4"
              >
                <div className="flex items-start gap-3 pb-3 border-b border-border/40">
                  <div className="p-2 bg-primary/10 rounded-[12px] text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Personal Identity</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Define how you appear within Campus Core.</p>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-semibold text-neutral-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="fullName"
                      type="text"
                      disabled={isLoading}
                      className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                      placeholder="e.g. Alex Mercer"
                      {...register("fullName")}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Card 2: Academic Details */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="glass-card rounded-[20px] border border-border p-6 space-y-4"
              >
                <div className="flex items-start gap-3 pb-3 border-b border-border/40">
                  <div className="p-2 bg-blue-500/10 rounded-[12px] text-blue-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Academic Details</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Your current institute enrollment and schedule configs.</p>
                  </div>
                </div>

                {/* College / University Name */}
                <div className="space-y-1.5">
                  <label htmlFor="collegeName" className="text-xs font-semibold text-neutral-300">
                    College / University
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <input
                      id="collegeName"
                      type="text"
                      disabled={isLoading}
                      className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                      placeholder="e.g. Stanford University"
                      {...register("collegeName")}
                    />
                  </div>
                  {errors.collegeName && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.collegeName.message}
                    </p>
                  )}
                </div>

                {/* Course & Semester Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Course */}
                  <div className="space-y-1.5">
                    <label htmlFor="course" className="text-xs font-semibold text-neutral-300">
                      Course / Degree
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                      </span>
                      <input
                        id="course"
                        type="text"
                        disabled={isLoading}
                        className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                        placeholder="e.g. Computer Science & Eng."
                        {...register("course")}
                      />
                    </div>
                    {errors.course && (
                      <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.course.message}
                      </p>
                    )}
                  </div>

                  {/* Semester */}
                  <div className="space-y-1.5">
                    <label htmlFor="semester" className="text-xs font-semibold text-neutral-300">
                      Current Semester
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Hash className="w-4 h-4" />
                      </span>
                      <select
                        id="semester"
                        disabled={isLoading}
                        className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer"
                        {...register("semester", { valueAsNumber: true })}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <option key={sem} value={sem}>
                            Semester {sem}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.semester && (
                      <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.semester.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Security & System */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="glass-card rounded-[20px] border border-border p-6 space-y-4"
              >
                <div className="flex items-start gap-3 pb-3 border-b border-border/40">
                  <div className="p-2 bg-yellow-500/10 rounded-[12px] text-yellow-500">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Security & Account</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Your core system authentication credentials.</p>
                  </div>
                </div>

                {/* Email Address (Non-Editable Account Lock) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1">
                    Account Email (Protected)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={user?.email || ""}
                      disabled
                      className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border/40 bg-neutral-950 text-neutral-500 text-sm focus:outline-none cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Submit Action Block */}
              <div className="flex items-center justify-between p-4 glass-card rounded-[20px] border border-border">
                <span className="text-[10px] text-muted-foreground">
                  {isDirty ? "● Unsaved changes detected" : "✓ Settings match database"}
                </span>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-11 px-6 rounded-[16px] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md duration-300 ${
                    isSavedRecently 
                      ? "bg-green-600 hover:bg-green-500 text-white shadow-green-500/20" 
                      : "bg-primary hover:bg-primary/95 text-white shadow-primary/20"
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSavedRecently ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Saved Successfully!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile updates
                    </>
                  )}
                </motion.button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

