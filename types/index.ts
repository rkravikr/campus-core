export interface Profile {
  id: string; // UUID primary key
  full_name: string | null;
  college_name: string | null;
  course: string | null;
  semester: number | null;
  created_at: string;
}

export interface Subject {
  id: string; // UUID primary key
  user_id: string; // foreign key to profiles
  subject_name: string;
  total_classes: number;
  attended_classes: number;
  semester: number;
  created_at: string;
}

export type AssignmentPriority = 'Low' | 'Medium' | 'High';

export interface Assignment {
  id: string; // UUID primary key
  user_id: string; // foreign key to profiles
  subject_id: string | null; // linked subject
  title: string;
  description: string | null;
  due_date: string; // ISO timestamp
  priority: AssignmentPriority;
  completed: boolean;
  semester: number;
  created_at: string;
}

export interface Exam {
  id: string; // UUID primary key
  user_id: string; // foreign key to profiles
  subject_id: string | null; // linked subject
  exam_type: string; // e.g. Midterm, Endterm, Quiz
  exam_date: string; // ISO timestamp
  semester: number;
  created_at: string;
}

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableEntry {
  id: string; // UUID primary key
  user_id: string; // foreign key to profiles
  subject_id: string | null; // linked subject
  day: Weekday;
  start_time: string; // format: HH:MM
  end_time: string; // format: HH:MM
  room: string | null;
  semester: number;
  created_at: string;
}

export interface Grade {
  id: string; // UUID primary key
  user_id: string; // foreign key to profiles
  semester: number;
  subject_name: string;
  credits: number;
  grade: string; // e.g. O, A+, A, B, C, F
  created_at: string;
}

// Derived UI stats for helper calculations
export interface AttendanceStats {
  percentage: number;
  status: 'Safe' | 'Warning' | 'Critical';
  bunksAvailable: number;
  bunksNeeded: number;
  message: string;
}
