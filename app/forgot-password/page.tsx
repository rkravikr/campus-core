"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Mail, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.resetPasswordForEmail(values.email);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      setAuthError(err.message || "Failed to submit request. Please verify your email and try again.");
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
        className="w-full max-w-md z-10"
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
            Reset Password
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            We will email you a secure link to reset your password.
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
                className="text-center py-6 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Email Dispatched</h3>
                <p className="text-xs text-muted-foreground max-w-xs mb-6 leading-relaxed">
                  If that email is registered in our system, we have sent a secure link to reset your account credentials.
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
                {/* Back button */}
                <div className="mb-4">
                  <Link 
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to login
                  </Link>
                </div>

                {/* Error notification */}
                {authError && (
                  <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="glow-btn w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
