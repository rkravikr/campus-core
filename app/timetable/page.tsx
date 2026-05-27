"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TimetableCard from "@/components/timetable/TimetableCard";
import AddTimetableModal from "@/components/timetable/AddTimetableModal";
import EditTimetableModal from "@/components/timetable/EditTimetableModal";
import { TimetableEntryWithSubject, timetableService } from "@/services/timetable.service";
import { Weekday } from "@/types";
import { 
  Plus, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Calendar,
  Layers,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntryWithSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active day on mobile tab (defaults to current day of the week!)
  const [activeMobileDay, setActiveMobileDay] = useState<Weekday>("Monday");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntryWithSubject | null>(null);

  const weekdays: Weekday[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Set the mobile active day to today's day of the week on mount
  useEffect(() => {
    const today = new Date().getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const currentDayMapped = today === 0 ? "Sunday" : weekdays[today - 1];
    setActiveMobileDay(currentDayMapped);
  }, []);

  // Fetch timetable entries
  const fetchTimetable = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await timetableService.getTimetable();
      setTimetable(data);
    } catch (err: any) {
      setError(err.message || "Failed to load weekly schedule. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Callbacks
  const handleAddSuccess = (newEntry: TimetableEntryWithSubject) => {
    setTimetable((prev) => [...prev, newEntry].sort((a, b) => a.start_time.localeCompare(b.start_time)));
  };

  const handleEditClick = (entry: TimetableEntryWithSubject) => {
    setSelectedEntry(entry);
    setIsEditOpen(true);
  };

  const handleEditSuccess = (updatedEntry: TimetableEntryWithSubject) => {
    setTimetable((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e)).sort((a, b) => a.start_time.localeCompare(b.start_time))
    );
  };

  const handleDeleteClick = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this class slot?")) return;
    try {
      await timetableService.deleteTimetableEntry(entryId);
      setTimetable((prev) => prev.filter((e) => e.id !== entryId));
    } catch (err) {
      console.error("Failed to delete class:", err);
      alert("Failed to delete class slot. Please try again.");
    }
  };

  // Helper: filter and sort classes for a given day
  const getDayClasses = (day: Weekday) => {
    return timetable
      .filter((e) => e.day === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const todayClassesCount = getDayClasses(activeMobileDay).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Weekly Timetable
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep check on your classroom timings, locations, and daily lectures.
            </p>
          </div>
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="glow-btn inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold shadow-md shadow-primary/10 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Class Slot
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-xs text-destructive-foreground">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state skeleton */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-14 w-full bg-card/20 rounded-xl border border-border animate-pulse md:hidden" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-card/20 rounded-xl border border-border animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* 1. MOBILE LAYOUT: Daily Tab timeline (visible on small screens) */}
            <div className="md:hidden space-y-4">
              {/* Sliding Daily switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                {weekdays.map((day) => {
                  const isActive = activeMobileDay === day;
                  const dayClassList = getDayClasses(day);
                  const count = dayClassList.length;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setActiveMobileDay(day)}
                      className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-1 rounded-xl border transition-all snap-center ${
                        isActive
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                          : "bg-card/40 border-border text-muted-foreground hover:text-white"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{day.slice(0, 3)}</span>
                      {count > 0 && (
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                          isActive ? "bg-white" : "bg-primary"
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Chronological Lecture List */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                    {activeMobileDay}'s Lectures ({todayClassesCount})
                  </h3>
                </div>

                {todayClassesCount === 0 ? (
                  /* Mobile Empty State */
                  <div className="glass-card rounded-xl border border-border p-10 text-center flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-neutral-300 font-medium">No classes scheduled for {activeMobileDay}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Enjoy your free day or study productive!</p>
                  </div>
                ) : (
                  <div className="relative border-l border-border/80 pl-4 ml-3 py-1 space-y-4">
                    {getDayClasses(activeMobileDay).map((entry) => (
                      <div key={entry.id} className="relative">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background shrink-0" />
                        
                        <TimetableCard
                          entry={entry}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteClick}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. DESKTOP LAYOUT: Full Weekly Board Columns (visible on md and above) */}
            <div className="hidden md:grid grid-cols-7 gap-3 text-left">
              {weekdays.map((day) => {
                const dayClasses = getDayClasses(day);
                const isToday = mounted && new Date().getDay() === (weekdays.indexOf(day) + 1) % 7; // checks if day matches today
                
                return (
                  <div key={day} className="flex flex-col gap-4">
                    {/* Column Header */}
                    <div className={`p-2 rounded-lg border text-center transition-colors ${
                      isToday
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-card/20 border-border/60 text-muted-foreground"
                    }`}>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">{day}</h4>
                      <span className="text-[9px] mt-0.5 block font-semibold">
                        {dayClasses.length} {dayClasses.length === 1 ? "Class" : "Classes"}
                      </span>
                    </div>

                    {/* Classes Grid Listing */}
                    <div className="space-y-3 flex-1 min-h-[400px] bg-neutral-900/10 rounded-lg p-1.5 border border-border/20">
                      {dayClasses.length === 0 ? (
                        <div className="h-full flex items-center justify-center p-4 border border-dashed border-border/20 rounded-md text-[10px] text-muted-foreground/30 text-center uppercase tracking-wider">
                          Free
                        </div>
                      ) : (
                        dayClasses.map((entry) => (
                          <TimetableCard
                            key={entry.id}
                            entry={entry}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Modals Containers */}
        <AddTimetableModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleAddSuccess}
        />

        <EditTimetableModal
          isOpen={isEditOpen}
          entry={selectedEntry}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedEntry(null);
          }}
          onSuccess={handleEditSuccess}
        />

      </div>
    </DashboardLayout>
  );
}
