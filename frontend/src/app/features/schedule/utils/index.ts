import { Assignment } from '@/app/shared/models/assignment';

const groupAssignmentsByDay = (assignments: Assignment[]): Map<number, Assignment[]> => {
  const dayMap = new Map<number, Assignment[]>();
  assignments.forEach((assignment) => {
    if (!dayMap.has(assignment.dayOfWeek)) {
      dayMap.set(assignment.dayOfWeek, []);
    }
    dayMap.get(assignment.dayOfWeek)!.push(assignment);
  });

  return dayMap;
};

const sortAssignmentsByChildName = (assignments: Assignment[]): Assignment[] => {
  return assignments.sort((a, b) => a.child.firstName.localeCompare(b.child.firstName));
};

export { groupAssignmentsByDay, sortAssignmentsByChildName };
