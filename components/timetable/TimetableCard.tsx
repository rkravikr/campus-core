"use client";

import React, { useState } from "react";
import { TimetableEntryWithSubject } from "@/services/timetable.service";
import { Clock, MapPin, MoreVertical, Trash2, Edit2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimetableCardProps {
  entry: TimetableEntryWithSubject;
  onEdit: (entry: TimetableEntryWithSubject) => void;
  onDelete: (entryId: string) => void;
}

export default function TimetableCard({
  entry,
  onEdit,
  onDelete,
}: TimetableCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Formats "09:00" or "09:00:00" to "9:00 AM"
  const formatTime12h = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="glass-card rounded-[20px] border border-border p-4 flex flex-col justify-between relative shadow-sm hover:border-primary/20 transition-all text-left">
      <div className="flex items-start justify-between gap-3">
        {/* Class Hours */}
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {formatTime12h(entry.start_time)} - {formatTime12h(entry.end_time)}
          </span>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-[8px] text-muted-foreground hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-1 w-32 bg-[#101014] border border-border rounded-[12px] shadow-xl z-40 py-1"
                >
                  <button
                    onClick={() => {
                      onEdit(entry);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 h-8 flex items-center gap-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Class
                  </button>
                  <button
                    onClick={() => {
                      onDelete(entry.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 h-8 flex items-center gap-2 text-left text-xs text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Class
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subject Link details */}
      <div className="mt-3">
        <h4 className="text-sm font-bold text-white tracking-wide uppercase line-clamp-1">
          {entry.subjects?.subject_name || "Unknown Subject"}
        </h4>
        
        {/* Room / Location */}
        {entry.room ? (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1.5 font-medium uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-neutral-500" />
            <span>{entry.room}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40 mt-1.5 font-medium uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-neutral-800" />
            <span>No room logged</span>
          </div>
        )}
      </div>

    </div>
  );
}
