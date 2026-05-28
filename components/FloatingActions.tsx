"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  BookOpen, 
  Percent, 
  Command,
  X 
} from "lucide-react";

interface FloatingActionsProps {
  onTrigger: (action: string) => void;
}

export default function FloatingActions({ onTrigger }: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actionItems = [
    { id: "quick-attendance", label: "Quick Attendance Update", icon: Percent, color: "bg-blue-500 hover:bg-blue-400" },
    { id: "add-assignment", label: "Add Coursework Task", icon: BookOpen, color: "bg-emerald-500 hover:bg-emerald-400" },
    { id: "command-menu", label: "Command Menu (⌘K)", icon: Command, color: "bg-purple-600 hover:bg-purple-500" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 text-right">
      {/* Expanded Speed-Dial Buttons */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-2.5 pb-2.5">
            {actionItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.9 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                  className="flex items-center gap-2 group cursor-pointer select-none"
                  onClick={() => {
                    onTrigger(item.id);
                    setIsOpen(false);
                  }}
                >
                  {/* Floating Action Tag Label */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/95 border border-border/80 text-[8px] font-bold text-neutral-200 px-2.5 py-1 rounded-[8px] shadow-lg uppercase tracking-widest select-none">
                    {item.label}
                  </span>
                  
                  {/* Round Mini Button */}
                  <button className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl ${item.color} border border-white/10 hover:scale-105 active:scale-95 transition-all`}>
                    <Icon className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Core Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 border border-white/10 ${
          isOpen ? "bg-destructive rotate-45" : "bg-primary shadow-primary/20"
        }`}
      >
        <Plus className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
