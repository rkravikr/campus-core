import { Grade } from "@/types";

/**
 * Maps standard Indian engineering letter grades to numerical point values (10-point scale).
 */
export function getGradePoints(grade: string): number {
  switch (grade.toUpperCase()) {
    case "O":
      return 10;
    case "A+":
      return 9;
    case "A":
      return 8;
    case "B+":
      return 7;
    case "B":
      return 6;
    case "C":
      return 5;
    case "P":
      return 4;
    case "F":
      return 0;
    case "AB":
      return 0;
    default:
      return 0;
  }
}

/**
 * Calculates Semester Grade Point Average (SGPA) for a specific semester.
 * Weighted by course credits.
 */
export function calculateSGPA(grades: Grade[], semester: number): number {
  const semGrades = grades.filter((g) => g.semester === semester);
  if (semGrades.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  semGrades.forEach((g) => {
    totalPoints += getGradePoints(g.grade) * g.credits;
    totalCredits += g.credits;
  });

  if (totalCredits === 0) return 0;
  
  const sgpa = totalPoints / totalCredits;
  return Math.round(sgpa * 100) / 100;
}

/**
 * Calculates Cumulative Grade Point Average (CGPA) across all logged semesters.
 * Uses global credit-weighted calculations.
 */
export function calculateCGPA(grades: Grade[]): number {
  if (grades.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach((g) => {
    totalPoints += getGradePoints(g.grade) * g.credits;
    totalCredits += g.credits;
  });

  if (totalCredits === 0) return 0;

  const cgpa = totalPoints / totalCredits;
  return Math.round(cgpa * 100) / 100;
}

/**
 * Calculates total credits registered/attempted.
 */
export function calculateTotalAttemptedCredits(grades: Grade[]): number {
  return grades.reduce((acc, curr) => acc + curr.credits, 0);
}

/**
 * Calculates total credits earned (excluding courses with grades 'F' or 'Ab').
 */
export function calculateTotalEarnedCredits(grades: Grade[]): number {
  return grades
    .filter((g) => g.grade.toUpperCase() !== "F" && g.grade.toUpperCase() !== "AB")
    .reduce((acc, curr) => acc + curr.credits, 0);
}
