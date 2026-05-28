import { Profile, Subject, Assignment, TimetableEntry, Grade, Exam } from "@/types";
import { AssignmentWithSubject } from "./assignment.service";
import { TimetableEntryWithSubject } from "./timetable.service";
import { ExamWithSubject } from "./exam.service";

// The virtual demo user details
export const DEMO_USER_ID = "demo-user-id";
export const DEMO_EMAIL = "demo@campuscore.app";

const PROFILE_KEY = "campus_core_demo_profile";
const SUBJECTS_KEY = "campus_core_demo_subjects";
const ASSIGNMENTS_KEY = "campus_core_demo_assignments";
const TIMETABLE_KEY = "campus_core_demo_timetable";
const GRADES_KEY = "campus_core_demo_grades";
const EXAMS_KEY = "campus_core_demo_exams";
const SESSION_KEY = "campus_core_demo_session";

// Pre-seeded Initial Profile
const INITIAL_PROFILE: Profile = {
  id: DEMO_USER_ID,
  full_name: "Alex Mercer",
  college_name: "Tech Institute of Technology",
  course: "Computer Science & Engineering",
  semester: 5,
  created_at: new Date().toISOString(),
};

// Pre-seeded Initial Subjects (Semester 5)
const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    user_id: DEMO_USER_ID,
    subject_name: "Computer Networks",
    total_classes: 24,
    attended_classes: 20, // 83.3% - Safe
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-2",
    user_id: DEMO_USER_ID,
    subject_name: "Database Systems",
    total_classes: 22,
    attended_classes: 15, // 68.1% - Warning
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-3",
    user_id: DEMO_USER_ID,
    subject_name: "Theory of Computation",
    total_classes: 20,
    attended_classes: 16, // 80.0% - Safe
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-4",
    user_id: DEMO_USER_ID,
    subject_name: "Artificial Intelligence",
    total_classes: 18,
    attended_classes: 17, // 94.4% - Safe
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-5",
    user_id: DEMO_USER_ID,
    subject_name: "Software Engineering Lab",
    total_classes: 12,
    attended_classes: 12, // 100% - Safe
    semester: 5,
    created_at: new Date().toISOString(),
  },
];

// Pre-seeded Initial Assignments (Semester 5)
const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "task-1",
    user_id: DEMO_USER_ID,
    subject_id: "sub-1",
    title: "CN Subnetting Assignment",
    description: "Design and calculate subnets for a 500-host enterprise network using VLSM.",
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0] + "T23:59:59Z", // Due Tomorrow
    priority: "High",
    completed: false,
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-2",
    user_id: DEMO_USER_ID,
    subject_id: "sub-2",
    title: "DBMS SQL Lab Report 6",
    description: "Submit all solved queries for joins, subqueries, and grouping sets from the lab exercises.",
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] + "T23:59:59Z", // Due in 3 days
    priority: "Medium",
    completed: false,
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-3",
    user_id: DEMO_USER_ID,
    subject_id: "sub-3",
    title: "TOC Turing Machine Homework",
    description: "Construct a Turing Machine model that accepts the language L = {a^n b^n c^n | n >= 0}.",
    due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] + "T12:00:00Z", // Overdue!
    priority: "High",
    completed: false,
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-4",
    user_id: DEMO_USER_ID,
    subject_id: "sub-4",
    title: "AI Minimax Algorithm Implementation",
    description: "Implement Adversarial Search utilizing Minimax and Alpha-Beta pruning in Python for a Tic-Tac-Toe grid.",
    due_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0] + "T23:59:59Z", // 7 days away
    priority: "Low",
    completed: true,
    semester: 5,
    created_at: new Date().toISOString(),
  },
];

// Pre-seeded Weekly Timetable (Semester 5)
const INITIAL_TIMETABLE: TimetableEntry[] = [
  {
    id: "time-1",
    user_id: DEMO_USER_ID,
    subject_id: "sub-1",
    day: "Monday",
    start_time: "09:00",
    end_time: "10:15",
    room: "Room 301, Block A",
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-2",
    user_id: DEMO_USER_ID,
    subject_id: "sub-2",
    day: "Monday",
    start_time: "10:30",
    end_time: "11:45",
    room: "Room 304, Block B",
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-3",
    user_id: DEMO_USER_ID,
    subject_id: "sub-4",
    day: "Tuesday",
    start_time: "11:15",
    end_time: "12:30",
    room: "Seminar Hall C",
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-4",
    user_id: DEMO_USER_ID,
    subject_id: "sub-3",
    day: "Wednesday",
    start_time: "09:00",
    end_time: "10:15",
    room: "Room 202, Block A",
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-5",
    user_id: DEMO_USER_ID,
    subject_id: "sub-5",
    day: "Thursday",
    start_time: "13:30",
    end_time: "15:30",
    room: "CSE Lab 3",
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-6",
    user_id: DEMO_USER_ID,
    subject_id: "sub-1",
    day: "Friday",
    start_time: "10:30",
    end_time: "11:45",
    room: "Room 301, Block A",
    semester: 5,
    created_at: new Date().toISOString(),
  },
];

// Pre-seeded Historical Grades (Semesters 1-4)
const INITIAL_GRADES: Grade[] = [
  // Semester 1 (GPA 9.20)
  { id: "g-1", user_id: DEMO_USER_ID, semester: 1, subject_name: "Mathematics I", credits: 4, grade: "A+", created_at: new Date().toISOString() },
  { id: "g-2", user_id: DEMO_USER_ID, semester: 1, subject_name: "Physics Lab", credits: 2, grade: "O", created_at: new Date().toISOString() },
  { id: "g-3", user_id: DEMO_USER_ID, semester: 1, subject_name: "Computer Programming", credits: 4, grade: "A+", created_at: new Date().toISOString() },
  { id: "g-4", user_id: DEMO_USER_ID, semester: 1, subject_name: "Engineering Drawing", credits: 3, grade: "A", created_at: new Date().toISOString() },
  
  // Semester 2 (GPA 9.00)
  { id: "g-5", user_id: DEMO_USER_ID, semester: 2, subject_name: "Mathematics II", credits: 4, grade: "A", created_at: new Date().toISOString() },
  { id: "g-6", user_id: DEMO_USER_ID, semester: 2, subject_name: "Data Structures", credits: 4, grade: "A+", created_at: new Date().toISOString() },
  { id: "g-7", user_id: DEMO_USER_ID, semester: 2, subject_name: "Digital Logic Design", credits: 3, grade: "A+", created_at: new Date().toISOString() },
  
  // Semester 3 (GPA 9.40)
  { id: "g-8", user_id: DEMO_USER_ID, semester: 3, subject_name: "Algorithms Analysis", credits: 4, grade: "O", created_at: new Date().toISOString() },
  { id: "g-9", user_id: DEMO_USER_ID, semester: 3, subject_name: "Discrete Mathematics", credits: 4, grade: "A+", created_at: new Date().toISOString() },
  { id: "g-10", user_id: DEMO_USER_ID, semester: 3, subject_name: "OOP Lab", credits: 2, grade: "O", created_at: new Date().toISOString() },
  
  // Semester 4 (GPA 9.25)
  { id: "g-11", user_id: DEMO_USER_ID, semester: 4, subject_name: "Operating Systems", credits: 4, grade: "A+", created_at: new Date().toISOString() },
  { id: "g-12", user_id: DEMO_USER_ID, semester: 4, subject_name: "Computer Architecture", credits: 4, grade: "A", created_at: new Date().toISOString() },
  { id: "g-13", user_id: DEMO_USER_ID, semester: 4, subject_name: "Microcontrollers Lab", credits: 2, grade: "O", created_at: new Date().toISOString() },
];

// Pre-seeded Upcoming Exams (Semester 5)
const INITIAL_EXAMS: Exam[] = [
  {
    id: "exam-1",
    user_id: DEMO_USER_ID,
    subject_id: "sub-1",
    exam_type: "Midterm Exam",
    exam_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days away
    semester: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "exam-2",
    user_id: DEMO_USER_ID,
    subject_id: "sub-2",
    exam_type: "Practical Lab Assessment",
    exam_date: new Date(Date.now() + 86400000 * 12).toISOString(), // 12 days away
    semester: 5,
    created_at: new Date().toISOString(),
  },
];

// Helper to seed localStorage with all initial values
export const seedDemoData = (force = false) => {
  if (typeof window === "undefined") return;

  if (force || !localStorage.getItem(PROFILE_KEY)) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(INITIAL_ASSIGNMENTS));
    localStorage.setItem(TIMETABLE_KEY, JSON.stringify(INITIAL_TIMETABLE));
    localStorage.setItem(GRADES_KEY, JSON.stringify(INITIAL_GRADES));
    localStorage.setItem(EXAMS_KEY, JSON.stringify(INITIAL_EXAMS));
  }
};

// Clear all demo data
export const clearDemoData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(SUBJECTS_KEY);
  localStorage.removeItem(ASSIGNMENTS_KEY);
  localStorage.removeItem(TIMETABLE_KEY);
  localStorage.removeItem(GRADES_KEY);
  localStorage.removeItem(EXAMS_KEY);
  localStorage.removeItem(SESSION_KEY);
};

// Generic read/write helpers
const readKey = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  seedDemoData();
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaultValue;
};

const writeKey = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

// API: Profile
export const getDemoProfile = (): Profile => {
  return readKey(PROFILE_KEY, INITIAL_PROFILE);
};

export const updateDemoProfile = (updates: Partial<Profile>): Profile => {
  const current = getDemoProfile();
  const next = { ...current, ...updates };
  writeKey(PROFILE_KEY, next);
  
  // Also sync virtual session storage
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    session.user.user_metadata = { ...session.user.user_metadata, ...updates };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return next;
};

// API: Subjects
export const getDemoSubjects = (semester?: number): Subject[] => {
  const all = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  const activeSem = semester !== undefined ? semester : getDemoProfile().semester || 1;
  return all.filter(s => s.semester === activeSem);
};

export const addDemoSubject = (subjectName: string, semester?: number): Subject => {
  const all = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  const activeSem = semester !== undefined ? semester : getDemoProfile().semester || 1;
  
  const newSubject: Subject = {
    id: `sub-${Date.now()}`,
    user_id: DEMO_USER_ID,
    subject_name: subjectName,
    total_classes: 0,
    attended_classes: 0,
    semester: activeSem,
    created_at: new Date().toISOString(),
  };

  writeKey(SUBJECTS_KEY, [...all, newSubject]);
  return newSubject;
};

export const updateDemoSubject = (subjectId: string, updates: Partial<Subject>): Subject => {
  const all = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  let updated: Subject | null = null;

  const next = all.map(s => {
    if (s.id === subjectId) {
      updated = { ...s, ...updates };
      return updated;
    }
    return s;
  });

  if (!updated) throw new Error("Subject not found");
  writeKey(SUBJECTS_KEY, next);
  return updated;
};

export const deleteDemoSubject = (subjectId: string): void => {
  const all = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  writeKey(SUBJECTS_KEY, all.filter(s => s.id !== subjectId));

  // Cascading deletes for timetables, assignments, exams
  const timetable = readKey<TimetableEntry[]>(TIMETABLE_KEY, INITIAL_TIMETABLE);
  writeKey(TIMETABLE_KEY, timetable.filter(t => t.subject_id !== subjectId));

  const assignments = readKey<Assignment[]>(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS);
  writeKey(ASSIGNMENTS_KEY, assignments.filter(a => a.subject_id !== subjectId));

  const exams = readKey<Exam[]>(EXAMS_KEY, INITIAL_EXAMS);
  writeKey(EXAMS_KEY, exams.filter(e => e.subject_id !== subjectId));
};

// API: Assignments
export const getDemoAssignments = (semester?: number): AssignmentWithSubject[] => {
  const all = readKey<Assignment[]>(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS);
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  const activeSem = semester !== undefined ? semester : getDemoProfile().semester || 1;

  return all
    .filter(a => a.semester === activeSem)
    .map(a => {
      const sub = subjects.find(s => s.id === a.subject_id);
      return {
        ...a,
        subjects: sub ? { subject_name: sub.subject_name } : null
      };
    });
};

export const addDemoAssignment = (
  assignment: Omit<Assignment, "id" | "user_id" | "created_at" | "completed" | "semester"> & { semester?: number }
): AssignmentWithSubject => {
  const all = readKey<Assignment[]>(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS);
  const activeSem = assignment.semester !== undefined ? assignment.semester : getDemoProfile().semester || 1;
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);

  const newAssignment: Assignment = {
    id: `task-${Date.now()}`,
    user_id: DEMO_USER_ID,
    subject_id: assignment.subject_id,
    title: assignment.title,
    description: assignment.description,
    due_date: assignment.due_date,
    priority: assignment.priority,
    completed: false,
    semester: activeSem,
    created_at: new Date().toISOString(),
  };

  writeKey(ASSIGNMENTS_KEY, [...all, newAssignment]);
  const sub = subjects.find(s => s.id === assignment.subject_id);
  return {
    ...newAssignment,
    subjects: sub ? { subject_name: sub.subject_name } : null
  };
};

export const updateDemoAssignment = (assignmentId: string, updates: Partial<Assignment>): AssignmentWithSubject => {
  const all = readKey<Assignment[]>(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS);
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  let updated: Assignment | null = null;

  const next = all.map(a => {
    if (a.id === assignmentId) {
      updated = { ...a, ...updates };
      return updated;
    }
    return a;
  });

  if (!updated) throw new Error("Assignment not found");
  writeKey(ASSIGNMENTS_KEY, next);
  const finalUpdated = updated as Assignment;
  const sub = subjects.find(s => s.id === finalUpdated.subject_id);
  return {
    ...finalUpdated,
    subjects: sub ? { subject_name: sub.subject_name } : null
  };
};

export const deleteDemoAssignment = (assignmentId: string): void => {
  const all = readKey<Assignment[]>(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS);
  writeKey(ASSIGNMENTS_KEY, all.filter(a => a.id !== assignmentId));
};

// API: Timetable
export const getDemoTimetable = (semester?: number): TimetableEntryWithSubject[] => {
  const all = readKey<TimetableEntry[]>(TIMETABLE_KEY, INITIAL_TIMETABLE);
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  const activeSem = semester !== undefined ? semester : getDemoProfile().semester || 1;

  return all
    .filter(t => t.semester === activeSem)
    .map(t => {
      const sub = subjects.find(s => s.id === t.subject_id);
      return {
        ...t,
        subjects: sub ? { subject_name: sub.subject_name } : null
      };
    });
};

export const addDemoTimetableEntry = (
  entry: Omit<TimetableEntry, "id" | "user_id" | "created_at" | "semester"> & { semester?: number }
): TimetableEntryWithSubject => {
  const all = readKey<TimetableEntry[]>(TIMETABLE_KEY, INITIAL_TIMETABLE);
  const activeSem = entry.semester !== undefined ? entry.semester : getDemoProfile().semester || 1;
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);

  const newEntry: TimetableEntry = {
    id: `time-${Date.now()}`,
    user_id: DEMO_USER_ID,
    subject_id: entry.subject_id,
    day: entry.day,
    start_time: entry.start_time,
    end_time: entry.end_time,
    room: entry.room,
    semester: activeSem,
    created_at: new Date().toISOString(),
  };

  writeKey(TIMETABLE_KEY, [...all, newEntry]);
  const sub = subjects.find(s => s.id === entry.subject_id);
  return {
    ...newEntry,
    subjects: sub ? { subject_name: sub.subject_name } : null
  };
};

export const updateDemoTimetableEntry = (entryId: string, updates: Partial<TimetableEntry>): TimetableEntryWithSubject => {
  const all = readKey<TimetableEntry[]>(TIMETABLE_KEY, INITIAL_TIMETABLE);
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  let updated: TimetableEntry | null = null;

  const next = all.map(t => {
    if (t.id === entryId) {
      updated = { ...t, ...updates };
      return updated;
    }
    return t;
  });

  if (!updated) throw new Error("Timetable entry not found");
  writeKey(TIMETABLE_KEY, next);
  const finalUpdated = updated as TimetableEntry;
  const sub = subjects.find(s => s.id === finalUpdated.subject_id);
  return {
    ...finalUpdated,
    subjects: sub ? { subject_name: sub.subject_name } : null
  };
};

export const deleteDemoTimetableEntry = (entryId: string): void => {
  const all = readKey<TimetableEntry[]>(TIMETABLE_KEY, INITIAL_TIMETABLE);
  writeKey(TIMETABLE_KEY, all.filter(t => t.id !== entryId));
};

// API: Grades
export const getDemoGrades = (): Grade[] => {
  return readKey<Grade[]>(GRADES_KEY, INITIAL_GRADES);
};

export const addDemoGrade = (grade: Omit<Grade, "id" | "user_id" | "created_at">): Grade => {
  const all = readKey<Grade[]>(GRADES_KEY, INITIAL_GRADES);

  const newGrade: Grade = {
    id: `g-${Date.now()}`,
    user_id: DEMO_USER_ID,
    semester: grade.semester,
    subject_name: grade.subject_name,
    credits: grade.credits,
    grade: grade.grade,
    created_at: new Date().toISOString(),
  };

  writeKey(GRADES_KEY, [...all, newGrade]);
  return newGrade;
};

export const updateDemoGrade = (gradeId: string, updates: Partial<Grade>): Grade => {
  const all = readKey<Grade[]>(GRADES_KEY, INITIAL_GRADES);
  let updated: Grade | null = null;

  const next = all.map(g => {
    if (g.id === gradeId) {
      updated = { ...g, ...updates };
      return updated;
    }
    return g;
  });

  if (!updated) throw new Error("Grade not found");
  writeKey(GRADES_KEY, next);
  return updated;
};

export const deleteDemoGrade = (gradeId: string): void => {
  const all = readKey<Grade[]>(GRADES_KEY, INITIAL_GRADES);
  writeKey(GRADES_KEY, all.filter(g => g.id !== gradeId));
};

// API: Exams
export const getDemoExams = (semester?: number): ExamWithSubject[] => {
  const all = readKey<Exam[]>(EXAMS_KEY, INITIAL_EXAMS);
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  const activeSem = semester !== undefined ? semester : getDemoProfile().semester || 1;

  return all
    .filter(e => e.semester === activeSem)
    .map(e => {
      const sub = subjects.find(s => s.id === e.subject_id);
      return {
        ...e,
        subjects: sub ? { subject_name: sub.subject_name } : null
      };
    });
};

export const addDemoExam = (
  exam: Omit<Exam, "id" | "user_id" | "created_at" | "semester"> & { semester?: number }
): ExamWithSubject => {
  const all = readKey<Exam[]>(EXAMS_KEY, INITIAL_EXAMS);
  const activeSem = exam.semester !== undefined ? exam.semester : getDemoProfile().semester || 1;
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);

  const newExam: Exam = {
    id: `exam-${Date.now()}`,
    user_id: DEMO_USER_ID,
    subject_id: exam.subject_id,
    exam_type: exam.exam_type,
    exam_date: exam.exam_date,
    semester: activeSem,
    created_at: new Date().toISOString(),
  };

  writeKey(EXAMS_KEY, [...all, newExam]);
  const sub = subjects.find(s => s.id === exam.subject_id);
  return {
    ...newExam,
    subjects: sub ? { subject_name: sub.subject_name } : null
  };
};

export const updateDemoExam = (examId: string, updates: Partial<Exam>): ExamWithSubject => {
  const all = readKey<Exam[]>(EXAMS_KEY, INITIAL_EXAMS);
  const subjects = readKey<Subject[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
  let updated: Exam | null = null;

  const next = all.map(e => {
    if (e.id === examId) {
      updated = { ...e, ...updates };
      return updated;
    }
    return e;
  });

  if (!updated) throw new Error("Exam not found");
  writeKey(EXAMS_KEY, next);
  const finalUpdated = updated as Exam;
  const sub = subjects.find(s => s.id === finalUpdated.subject_id);
  return {
    ...finalUpdated,
    subjects: sub ? { subject_name: sub.subject_name } : null
  };
};

export const deleteDemoExam = (examId: string): void => {
  const all = readKey<Exam[]>(EXAMS_KEY, INITIAL_EXAMS);
  writeKey(EXAMS_KEY, all.filter(e => e.id !== examId));
};
