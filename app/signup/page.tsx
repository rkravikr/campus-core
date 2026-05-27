"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  BookOpen, 
  Hash,
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";

// Form validation schema
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  collegeName: z.string().min(3, "College name must be at least 3 characters"),
  course: z.string().min(2, "Course must be at least 2 characters"),
  semester: z.number().min(1).max(8, "Semester must be between 1 and 8"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      collegeName: "",
      course: "",
      semester: 1,
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.signUpWithEmail(values.email, values.password, {
        full_name: values.fullName,
        college_name: values.collegeName,
        course: values.course,
        semester: values.semester,
      });
      setIsSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      setAuthError(err.message || "Failed to create your account. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden bg-background">
      {/* Background blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Main card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase mb-1.5">
            Campus Core
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Build your personalized student control center in seconds.
          </p>
        </div>

        {/* Form panel */}
        <div className="glass-card rounded-xl border border-border p-6 shadow-xl">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Check Your Email</h3>
                <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                  We have sent a verification link to your email. Click the link inside to verify and access your new Campus Core dashboard.
                </p>
                <Link 
                  href="/login" 
                  className="glow-btn inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-white text-xs font-semibold shadow-md shadow-primary/10"
                >
                  Return to Login
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form">
                {/* Error notification */}
                {authError && (
                  <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Two column grid for name & college */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
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
                          placeholder="Arjun Sharma"
                          disabled={isLoading}
                          className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                          {...register("fullName")}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-[10px] text-destructive font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* College Name */}
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
                          placeholder="IIT Delhi"
                          disabled={isLoading}
                          className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                          {...register("collegeName")}
                        />
                      </div>
                      {errors.collegeName && (
                        <p className="text-[10px] text-destructive font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.collegeName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Two column grid for course & semester */}
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
                          placeholder="B.Tech Computer Science"
                          disabled={isLoading}
                          className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                          {...register("course")}
                        />
                      </div>
                      {errors.course && (
                        <p className="text-[10px] text-destructive font-medium flex items-center gap-1">
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
                          className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors appearance-none cursor-pointer text-white"
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
                        <p className="text-[10px] text-destructive font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.semester.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-neutral-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        id="email"
                        type="email"
                        placeholder="name@college.edu"
                        disabled={isLoading}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-xs font-semibold text-neutral-300">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                        {...register("password")}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="glow-btn w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
