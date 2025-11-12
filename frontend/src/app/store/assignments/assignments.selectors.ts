import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AssignmentsState, assignmentsAdapter } from './assignments.state';
import { Assignment } from '../../shared/models/assignment';

export const selectAssignmentsState =
  createFeatureSelector<AssignmentsState>('assignments');

const { selectAll, selectEntities, selectIds, selectTotal } =
  assignmentsAdapter.getSelectors();

export const selectAllAssignments = createSelector(
  selectAssignmentsState,
  selectAll
);

export const selectAssignmentEntities = createSelector(
  selectAssignmentsState,
  selectEntities
);

export const selectAssignmentIds = createSelector(
  selectAssignmentsState,
  selectIds
);

export const selectAssignmentsLoading = createSelector(
  selectAssignmentsState,
  (state) => state.loading
);

export const selectAssignmentsError = createSelector(
  selectAssignmentsState,
  (state) => state.error
);

export const selectAssignmentById = (id: string) =>
  createSelector(selectAssignmentEntities, (entities) => entities[id]);

export const selectAssignmentsByLocation = (locationId: string) =>
  createSelector(selectAllAssignments, (assignments) =>
    assignments.filter((a) => a.locationId === locationId)
  );

export const selectAssignmentsByLocationAndDay = (
  locationId: string,
  dayOfWeek: number
) =>
  createSelector(selectAllAssignments, (assignments) =>
    assignments.filter(
      (a) => a.locationId === locationId && a.dayOfWeek === dayOfWeek
    )
  );

// Selector to group assignments by location and day
// Returns a Map<locationId, DayOfWeek[]>
export const selectAssignmentsByLocationAndDayGrouped = createSelector(
  selectAllAssignments,
  (assignments) => {
    const grouped = new Map<string, DayOfWeek[]>();

    assignments.forEach((assignment) => {
      if (!grouped.has(assignment.locationId)) {
        grouped.set(assignment.locationId, []);
      }

      const days = grouped.get(assignment.locationId)!;
      let dayGroup = days.find((d) => d.dayOfWeek === assignment.dayOfWeek);

      if (!dayGroup) {
        dayGroup = {
          dayOfWeek: assignment.dayOfWeek,
          assignments: [],
          capacity: null,
        };
        days.push(dayGroup);
      }

      dayGroup.assignments.push(assignment);
    });

    // Sort assignments within each day by child firstName
    grouped.forEach((days) => {
      days.forEach((day) => {
        day.assignments.sort((a, b) =>
          a.child.firstName.localeCompare(b.child.firstName)
        );
      });
    });

    return grouped;
  }
);

// Helper interface for grouped assignments
export interface DayOfWeek {
  dayOfWeek: number;
  assignments: Assignment[];
  capacity: number | null;
}