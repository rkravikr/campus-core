"use client";

import React, { useState, useEffect, useRef } from "react";
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
  GraduationCap,
  Trash2,
  Edit3,
  Eye,
  Camera,
  Phone,
  FileText,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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
  usn: z.string().optional().nullable().or(z.literal("")),
  mobileNumber: z
    .string()
    .regex(/^$|^\+?[0-9\s-]{10,15}$/, "Invalid mobile number format")
    .optional()
    .nullable()
    .or(z.literal("")),
  bio: z.string().max(200, "Bio must be under 200 characters").optional().nullable().or(z.literal("")),
  linkedinUrl: z
    .string()
    .regex(/^$|^https:\/\/(www\.)?linkedin\.com\/.*$/, "Must be a valid LinkedIn profile URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .regex(/^$|^https:\/\/(www\.)?github\.com\/.*$/, "Must be a valid GitHub profile URL")
    .optional()
    .nullable()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, fetchProfile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Danger zone account deletion states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Avatar upload state
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Profile Completeness calculation
  const calculateCompleteness = () => {
    if (!profile) return 0;
    let score = 0;
    // Required fields: 15% each (60% max)
    if (profile.full_name) score += 15;
    if (profile.college_name) score += 15;
    if (profile.course) score += 15;
    if (profile.semester) score += 15;
    
    // Optional recommended fields: 8% each (40% max)
    if (profile.usn) score += 8;
    if (profile.mobile_number) score += 8;
    if (profile.bio) score += 8;
    if (profile.linkedin_url) score += 8;
    if (profile.github_url) score += 8;
    
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== "DELETE") return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await authService.deleteAccount();
      
      // Purge state and redirect to register page
      const { clearSession } = useAuthStore.getState();
      clearSession();
      router.push("/signup");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      setDeleteError(err.message || "Failed to purge account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

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
        usn: profile.usn || "",
        mobileNumber: profile.mobile_number || "",
        bio: profile.bio || "",
        linkedinUrl: profile.linkedin_url || "",
        githubUrl: profile.github_url || "",
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
        usn: values.usn || null,
        mobile_number: values.mobileNumber || null,
        bio: values.bio || null,
        linkedin_url: values.linkedinUrl || null,
        github_url: values.githubUrl || null,
      });

      // 2. Refetch profile in Zustand store for real-time app sync
      await fetchProfile(user.id);
      
      setSuccessMsg("Your student profile has been updated successfully!");
      setIsSavedRecently(true);
      setIsEditing(false);
      
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
              
              {/* Round Avatar with Upload Overlay */}
              <div className="relative group mb-4">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !user) return;
                    
                    // Validate file size (2MB max)
                    if (file.size > 2 * 1024 * 1024) {
                      setAvatarError("Image must be under 2MB.");
                      setTimeout(() => setAvatarError(null), 4000);
                      return;
                    }

                    setIsUploadingAvatar(true);
                    setAvatarError(null);
                    try {
                      const avatarUrl = await authService.uploadAvatar(user.id, file);
                      await authService.updateProfile(user.id, { avatar_url: avatarUrl });
                      await fetchProfile(user.id);
                    } catch (err: any) {
                      console.error("Avatar upload failed:", err);
                      setAvatarError(err.message || "Failed to upload avatar.");
                      setTimeout(() => setAvatarError(null), 4000);
                    } finally {
                      setIsUploadingAvatar(false);
                      // Reset file input so same file can be re-selected
                      if (avatarInputRef.current) avatarInputRef.current.value = "";
                    }
                  }}
                />
                
                {/* Avatar circle */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-primary/20 cursor-pointer relative overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-all"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center">
                      {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "S"}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploadingAvatar ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>

                {/* Upload status indicator */}
                {isUploadingAvatar && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Uploading...
                  </div>
                )}
              </div>

              {/* Avatar error message */}
              {avatarError && (
                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mb-2">
                  <AlertCircle className="w-3 h-3" />
                  {avatarError}
                </p>
              )}

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

              {/* Profile Completeness progress meter */}
              <div className="w-full border-t border-border/40 mt-4 pt-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-left">
                  <span className="text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    Completeness:
                  </span>
                  <span className={`font-black tracking-wider ${completeness === 100 ? "text-green-400" : "text-primary"}`}>
                    {completeness}%
                  </span>
                </div>
                
                {/* Progress track */}
                <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-border/20 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary via-blue-500 to-indigo-500 rounded-full"
                  />
                </div>
                
                {completeness < 100 ? (
                  <p className="text-[8px] text-muted-foreground leading-normal text-left font-medium">
                    💡 Tip: Add missing optional details below to reach 100%!
                  </p>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-[8px] text-green-400 font-bold bg-green-500/10 py-1 px-2 rounded-full border border-green-500/20 uppercase tracking-wider">
                    ✓ Profile Complete
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`w-full mt-5 h-9 rounded-[12px] text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  isEditing 
                    ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 shadow-yellow-500/5" 
                    : "bg-primary/15 hover:bg-primary/20 text-primary border border-primary/20 shadow-primary/5"
                }`}
              >
                {isEditing ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    Lock Form (View)
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </>
                )}
              </button>
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
                      disabled={isLoading || !isEditing}
                      className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

                {/* Bio / Tagline */}
                <div className="space-y-1.5">
                  <label htmlFor="bio" className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                    <span>Bio / Tagline</span>
                    {!profile?.bio && (
                      <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" /> Recommended
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-muted-foreground">
                      <FileText className="w-4 h-4" />
                    </span>
                    <textarea
                      id="bio"
                      disabled={isLoading || !isEditing}
                      className="w-full h-20 pl-10 pr-4 py-2.5 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none"
                      placeholder="e.g. Aspiring systems builder | CS Sophomore"
                      {...register("bio")}
                    />
                  </div>
                  {errors.bio && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.bio.message}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label htmlFor="mobileNumber" className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                    <span>Mobile Number</span>
                    {!profile?.mobile_number && (
                      <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" /> Recommended
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="mobileNumber"
                      type="tel"
                      disabled={isLoading || !isEditing}
                      className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      placeholder="e.g. +1 555-0199"
                      {...register("mobileNumber")}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <label htmlFor="linkedinUrl" className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                      <span>LinkedIn Profile</span>
                      {!profile?.linkedin_url && (
                        <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 shrink-0" /> Recommended
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </span>
                      <input
                        id="linkedinUrl"
                        type="url"
                        disabled={isLoading || !isEditing}
                        className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        placeholder="e.g. https://linkedin.com/in/alex"
                        {...register("linkedinUrl")}
                      />
                    </div>
                    {errors.linkedinUrl && (
                      <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.linkedinUrl.message}
                      </p>
                    )}
                  </div>

                  {/* GitHub */}
                  <div className="space-y-1.5">
                    <label htmlFor="githubUrl" className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                      <span>GitHub Profile</span>
                      {!profile?.github_url && (
                        <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 shrink-0" /> Recommended
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </span>
                      <input
                        id="githubUrl"
                        type="url"
                        disabled={isLoading || !isEditing}
                        className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        placeholder="e.g. https://github.com/alex"
                        {...register("githubUrl")}
                      />
                    </div>
                    {errors.githubUrl && (
                      <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.githubUrl.message}
                      </p>
                    )}
                  </div>
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
                      disabled={isLoading || !isEditing}
                      className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

                {/* USN */}
                <div className="space-y-1.5">
                  <label htmlFor="usn" className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                    <span>University Serial Number (USN)</span>
                    {!profile?.usn && (
                      <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" /> Recommended
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Hash className="w-4 h-4" />
                    </span>
                    <input
                      id="usn"
                      type="text"
                      disabled={isLoading || !isEditing}
                      className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      placeholder="e.g. 1MS21CS001"
                      {...register("usn")}
                    />
                  </div>
                  {errors.usn && (
                    <p className="text-[10px] text-destructive font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.usn.message}
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
                        disabled={isLoading || !isEditing}
                        className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-background/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        disabled={isLoading || !isEditing}
                        className="w-full h-11 pl-10 pr-4 rounded-[14px] border border-border bg-[#101014] text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Card 4: Danger Zone */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.12 }}
                className="glass-card rounded-[20px] border border-destructive/20 p-6 space-y-4 bg-destructive/5"
              >
                <div className="flex items-start gap-3 pb-3 border-b border-destructive/10">
                  <div className="p-2 bg-destructive/10 rounded-[12px] text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-destructive uppercase tracking-wider">Danger Zone</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Irreversible system options.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">Delete Student Account</h4>
                    <p className="text-[10px] text-muted-foreground max-w-md">
                      Permanently erase your student profile and all associated tracker data including subjects, assignments, timetable, exams, and grades. This action is absolute and cannot be undone.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="h-10 px-4 rounded-[14px] bg-destructive/10 hover:bg-destructive hover:text-white border border-destructive/30 hover:border-destructive text-destructive text-xs font-bold transition-all self-start sm:self-center shrink-0"
                  >
                    Delete Account
                  </button>
                </div>
              </motion.div>

              {/* Submit Action Block (only shown when editing and form is dirty) */}
              {isEditing && isDirty && (
                <div className="flex items-center justify-between p-4 glass-card rounded-[20px] border border-border">
                  <span className="text-[10px] text-muted-foreground font-medium">
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
              )}

            </form>
          </div>

        </div>

      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isDeleting) {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmationText("");
                  setDeleteError(null);
                }
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-card rounded-[20px] border border-destructive/30 bg-[#0F0F12] p-6 space-y-6 shadow-2xl z-10 overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-destructive/10 blur-[80px]" />

              <div className="space-y-2 text-center">
                <div className="mx-auto w-12 h-12 bg-destructive/10 border border-destructive/20 text-destructive rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-base font-extrabold text-white">Delete Account Permanently?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This action is irreversible. All of your subjects, assignments, timetable schedules, exams, and academic grades will be permanently purged.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-[14px] p-3 text-center">
                  <p className="text-[10px] text-destructive-foreground font-semibold">
                    To confirm deletion, type <span className="underline font-bold text-white tracking-widest px-1">DELETE</span> below.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="text"
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirmationText}
                    disabled={isDeleting}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    className="w-full h-11 px-4 rounded-[14px] border border-border bg-neutral-950 text-white text-sm focus:outline-none focus:ring-1 focus:ring-destructive focus:border-destructive text-center uppercase placeholder:lowercase placeholder:text-neutral-600 font-bold"
                  />
                </div>

                {deleteError && (
                  <p className="text-[10px] text-destructive text-center font-medium flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {deleteError}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteConfirmationText("");
                    setDeleteError(null);
                  }}
                  className="flex-1 h-11 rounded-[14px] bg-neutral-900 border border-border hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting || deleteConfirmationText !== "DELETE"}
                  onClick={handleDeleteAccount}
                  className="flex-1 h-11 rounded-[14px] bg-destructive hover:bg-destructive/90 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-destructive/15"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirm Purge"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

