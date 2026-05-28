"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Percent, 
  Award, 
  User, 
  Plus, 
  ArrowRight,
  Command
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAction: (action: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onQuickAction }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems = [
    { id: "nav-dash", title: "Go to Dashboard Home", category: "Navigation", icon: Sparkles, action: () => router.push("/dashboard") },
    { id: "nav-attend", title: "Go to Attendance Tracker", category: "Navigation", icon: Percent, action: () => router.push("/attendance") },
    { id: "nav-tasks", title: "Go to Coursework Assignments", category: "Navigation", icon: BookOpen, action: () => router.push("/assignments") },
    { id: "nav-table", title: "Go to Weekly Timetable Grid", category: "Navigation", icon: Calendar, action: () => router.push("/timetable") },
    { id: "nav-cgpa", title: "Go to Academic CGPA Log", category: "Navigation", icon: Award, action: () => router.push("/cgpa") },
    { id: "nav-profile", title: "Go to Student Settings", category: "Navigation", icon: User, action: () => router.push("/profile") },
    { id: "act-task", title: "Quick Add Assignment", category: "Quick Action", icon: Plus, action: () => onQuickAction("add-assignment") },
    { id: "act-attend", title: "Quick Attendance Update", category: "Quick Action", icon: Percent, action: () => onQuickAction("quick-attendance") },
  ];

  // Filter commands by search
  const filteredCommands = commandItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full max-w-xl bg-card/95 border border-border rounded-[20px] shadow-2xl relative z-10 overflow-hidden glass-card text-left"
          >
            {/* Search Input Area */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search tools, pages, or quick actions..."
                className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[9px] font-bold text-muted-foreground/80 bg-neutral-900 border border-border/80 px-2 py-0.5 rounded-[6px] shrink-0 uppercase select-none">
                esc
              </kbd>
            </div>

            {/* Commands Feed List */}
            <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No commands matching your query.
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCommands.map((cmd, idx) => {
                    const isSelected = selectedIndex === idx;
                    const CmdIcon = cmd.icon;

                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        className={`w-full p-2.5 rounded-[12px] flex items-center justify-between transition-colors text-left ${
                          isSelected 
                            ? "bg-primary/10 border-primary/20 text-white" 
                            : "hover:bg-neutral-900/40 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-1.5 rounded-[8px] shrink-0 ${
                            isSelected ? "bg-primary/20 text-primary" : "bg-neutral-900 text-muted-foreground"
                          }`}>
                            <CmdIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-xs font-bold block ${isSelected ? "text-white" : "text-neutral-300"}`}>
                              {cmd.title}
                            </span>
                            <span className="text-[8px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">
                              {cmd.category}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[8px] font-bold text-primary uppercase tracking-widest">
                              Select
                            </span>
                            <ArrowRight className="w-3 h-3 text-primary animate-pulse" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Command Palette footer */}
            <div className="px-4 py-2 bg-neutral-950 border-t border-border/40 flex items-center justify-between text-[8px] text-muted-foreground font-semibold uppercase tracking-widest select-none">
              <span className="flex items-center gap-1">
                <Command className="w-3.5 h-3.5" />
                Ctrl + K triggers anywhere
              </span>
              <div className="flex items-center gap-2">
                <span>↑↓ navigate</span>
                <span>⏎ select</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
