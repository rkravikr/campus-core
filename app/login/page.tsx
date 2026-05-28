"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const errorParam = searchParams.get("error");
  
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { session } = useAuthStore();

  // Handle callback errors or info
  useEffect(() => {
    if (errorParam === "auth-code-exchange-failed") {
      setAuthError("Failed to authenticate. The verification code expired or is invalid.");
    }
  }, [errorParam]);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (session) {
      router.push(redirectTo);
    }
  }, [session, router, redirectTo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.signInWithEmail(values.email, values.password);
      router.refresh();
      router.push(redirectTo);
    } catch (err: any) {
      setAuthError(err.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || "Could not connect to Google OAuth.");
      setIsGoogleLoading(false);
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
            Welcome Back
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Access your academic dashboard and schedule.
          </p>
        </div>

        {/* Form panel */}
        <div className="glass-card rounded-xl border border-border p-6 shadow-xl">
          {/* Error notifications */}
          <AnimatePresence mode="wait">
            {authError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  disabled={isLoading || isGoogleLoading}
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-neutral-300">
                  Password
                </label>
                <Link 
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isGoogleLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-destructive font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="glow-btn w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/80" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#101014] px-2.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full h-11 rounded-lg border border-border bg-background/30 hover:bg-background/80 text-foreground text-sm font-medium flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Sign In with Google
              </>
            )}
          </button>

          {/* Quick Sandbox Demo Auto-Login Shortcut */}
          <div className="mt-5 pt-4 border-t border-border/60 text-center">
            <span className="text-[10px] text-muted-foreground block mb-2 font-medium">
              Want to check out V1 without registering?
            </span>
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                setAuthError(null);
                try {
                  const { data } = await authService.signInWithEmail("demo@campuscore.app", "demo1234");
                  if (data?.session) {
                    await useAuthStore.getState().setSession(data.session as any);
                    router.refresh();
                    router.push(redirectTo);
                  }
                } catch (err: any) {
                  setAuthError(err.message || "Failed to auto-sign-in to Demo.");
                  setIsLoading(false);
                }
              }}
              disabled={isLoading || isGoogleLoading}
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer hover:underline"
            >
              🔑 Launch Sandbox Demo Mode
            </button>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
