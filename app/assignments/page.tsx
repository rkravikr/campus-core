"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import AssignmentCard from "@/components/assignments/AssignmentCard";
import AddAssignmentModal from "@/components/assignments/AddAssignmentModal";
import EditAssignmentModal from "@/components/assignments/EditAssignmentModal";
import { AssignmentWithSubject, assignmentService } from "@/services/assignment.service";
import { attendanceService } from "@/services/attendance.service";
import { Subject } from "@/types";
import { 
  Plus, 
  CheckSquare, 
  AlertCircle, 
  Loader2, 
  Filter, 
  ClipboardList, 
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type StatusFilter = "All" | "Pending" | "Completed";
type PriorityFilter = "All" | "High" | "Medium" | "Low";

import { useAuthStore } from "@/store/authStore";

export default function AssignmentsPage() {
  const { profile } = useAuthStore();
  const [assignments, setAssignments] = useState<AssignmentWithSubject[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [subjectFilter, setSubjectFilter] = useState<string>("All");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithSubject | null>(null);

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [assignmentsData, subjectsData] = await Promise.all([
        assignmentService.getAssignments(),
        attendanceService.getSubjects(),
      ]);
      setAssignments(assignmentsData);
      setSubjects(subjectsData);
    } catch (err: any) {
      setError(err.message || "Failed to load assignments. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile?.semester]);

  // Callbacks
  const handleAddSuccess = (newAssignment: AssignmentWithSubject) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  const handleEditClick = (assignment: AssignmentWithSubject) => {
    setSelectedAssignment(assignment);
    setIsEditOpen(true);
  };

  const handleEditSuccess = (updatedAssignment: AssignmentWithSubject) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );
  };

  const handleDeleteClick = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await assignmentService.deleteAssignment(assignmentId);
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    } catch (err) {
      console.error("Failed to delete assignment:", err);
      alert("Failed to delete assignment. Please try again.");
    }
  };

  const handleAssignmentUpdate = (updated: AssignmentWithSubject) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  // Aggregate stats
  const totalPending = assignments.filter((a) => !a.completed).length;
  const totalCompleted = assignments.filter((a) => a.completed).length;
  const totalOverdue = assignments.filter((a) => !a.completed && new Date(a.due_date) < new Date()).length;

  // Filtered list
  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && !a.completed) ||
      (statusFilter === "Completed" && a.completed);

    const matchesPriority =
      priorityFilter === "All" || a.priority === priorityFilter;

    const matchesSubject =
      subjectFilter === "All" || a.subject_id === subjectFilter;

    return matchesStatus && matchesPriority && matchesSubject;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Assignment Tracker
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep track of deadlines, priorities, and project deliverables.
            </p>
          </div>
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="glow-btn inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold shadow-md shadow-primary/10 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Assignment
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-card/20 rounded-xl border border-border animate-pulse" />
              ))}
            </div>
            <div className="h-12 w-full bg-card/20 rounded-xl border border-border animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[140px] bg-card/20 rounded-xl border border-border animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Stat 1: Pending */}
              <div className="glass-card rounded-[20px] border border-border p-4 text-left">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Pending Tasks</span>
                <span className="text-xl font-black text-white mt-1 block">{totalPending}</span>
              </div>
              
              {/* Stat 2: Completed */}
              <div className="glass-card rounded-[20px] border border-border p-4 text-left">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Completed</span>
                <span className="text-xl font-black text-white mt-1 block">{totalCompleted}</span>
              </div>

              {/* Stat 3: Overdue */}
              <div className={`glass-card rounded-[20px] border p-4 text-left ${
                totalOverdue > 0 ? "border-destructive/30 bg-destructive/5" : "border-border"
              }`}>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Overdue</span>
                <span className={`text-xl font-black mt-1 block ${totalOverdue > 0 ? "text-destructive" : "text-white"}`}>
                  {totalOverdue}
                </span>
              </div>
            </div>

            {/* Interactive Filters Panel */}
            <div className="glass-card rounded-[20px] border border-border p-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Status Segment Buttons */}
              <div className="flex p-0.5 rounded-[12px] bg-background/50 border border-border max-w-xs">
                {(["Pending", "Completed", "All"] as StatusFilter[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-[10px] text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      statusFilter === tab
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Priority & Subject filters Dropdowns */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Priority Selection */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                    className="h-9 px-3 rounded-[14px] border border-border bg-[#101014] text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                {/* Subject Selection */}
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="h-9 px-3 rounded-[14px] border border-border bg-[#101014] text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white cursor-pointer max-w-[150px]"
                  >
                    <option value="All">All Subjects</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.subject_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Assignments Grid */}
            {filteredAssignments.length === 0 ? (
              /* Filter Empty State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl border border-border p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-12"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {statusFilter === "Completed" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <ClipboardList className="w-5 h-5" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  No Assignments Found
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                  {statusFilter === "Completed"
                    ? "You haven't completed any assignments yet. Keep working on your deliverables!"
                    : "Excellent! You have zero pending assignments matching this filter scale."}
                </p>
                {statusFilter === "Pending" && (
                  <button
                    onClick={() => setIsAddOpen(true)}
                    className="glow-btn h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/10 transition-colors"
                  >
                    Create New Task
                  </button>
                )}
              </motion.div>
            ) : (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredAssignments.map((assign) => (
                    <motion.div
                      key={assign.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AssignmentCard
                        assignment={assign}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onUpdate={handleAssignmentUpdate}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {/* Modals Containers */}
        <AddAssignmentModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleAddSuccess}
        />

        <EditAssignmentModal
          isOpen={isEditOpen}
          assignment={selectedAssignment}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedAssignment(null);
          }}
          onSuccess={handleEditSuccess}
        />

      </div>
    </DashboardLayout>
  );
}
