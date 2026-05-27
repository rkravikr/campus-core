import { AttendanceStats } from "@/types";

/**
 * Calculates student attendance statistics and provides safety recommendations.
 * Ensures strict compliance with college limits.
 * 
 * @param attended Number of classes attended
 * @param total Total number of classes held
 * @param threshold Attendance target percentage (default: 75)
 */
export function calculateAttendanceStats(
  attended: number,
  total: number,
  threshold: number = 75
): AttendanceStats {
  // Edge Case: No classes held yet
  if (total === 0) {
    return {
      percentage: 100,
      status: "Safe",
      bunksAvailable: 0,
      bunksNeeded: 0,
      message: "No lectures held yet. Starting with a clean record!",
    };
  }

  // Calculate percentage
  const percentage = (attended / total) * 100;

  // Case 1: Attendance is safe (above or equal to threshold)
  if (percentage >= threshold) {
    // Formula for safe bunks: floor((attended * 100 - threshold * total) / threshold)
    const bunksAvailable = Math.floor(
      (attended * 100 - threshold * total) / threshold
    );

    const isCloseToBoundary = percentage < threshold + 5; // e.g., between 75% and 80%

    return {
      percentage: Math.round(percentage * 10) / 10,
      status: isCloseToBoundary ? "Warning" : "Safe",
      bunksAvailable,
      bunksNeeded: 0,
      message:
        bunksAvailable > 0
          ? `You can safely bunk the next ${bunksAvailable} class${
              bunksAvailable === 1 ? "" : "es"
            }.`
          : "You cannot bunk any more classes without falling below the limit!",
    };
  }

  // Case 2: Attendance shortage (below threshold)
  // Formula for needed classes: ceil((threshold * total - 100 * attended) / (100 - threshold))
  const bunksNeeded = Math.ceil(
    (threshold * total - 100 * attended) / (100 - threshold)
  );

  return {
    percentage: Math.round(percentage * 10) / 10,
    status: "Critical",
    bunksAvailable: 0,
    bunksNeeded,
    message: `Attendance shortage! You must attend the next ${bunksNeeded} class${
      bunksNeeded === 1 ? "" : "es"
    } consecutively.`,
  };
}
