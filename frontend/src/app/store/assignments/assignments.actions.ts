import { createAction, props } from '@ngrx/store';
import { Assignment, CreateAssignment } from '../../shared/models/assignment';

// Load assignments
export const loadAssignments = createAction(
  '[Assignments] Load Assignments',
  props<{ locationId: string }>()
);

export const loadAssignmentsSuccess = createAction(
  '[Assignments] Load Assignments Success',
  props<{ assignments: Assignment[]; locationId: string }>()
);

export const loadAssignmentsFailure = createAction(
  '[Assignments] Load Assignments Failure',
  props<{ error: string; locationId: string }>()
);

// Create assignment with optimistic update
export const createAssignment = createAction(
  '[Assignments] Create Assignment',
  props<{ dto: CreateAssignment; tempId: string }>()
);

export const createAssignmentSuccess = createAction(
  '[Assignments] Create Assignment Success',
  props<{ assignment: Assignment; tempId: string }>()
);

export const createAssignmentFailure = createAction(
  '[Assignments] Create Assignment Failure',
  props<{ error: string; tempId: string }>()
);

export const createAssignmentRollback = createAction(
  '[Assignments] Create Assignment Rollback',
  props<{ tempId: string }>()
);

// Delete assignment with optimistic update
export const deleteAssignment = createAction(
  '[Assignments] Delete Assignment',
  props<{ assignmentId: string }>()
);

export const deleteAssignmentSuccess = createAction(
  '[Assignments] Delete Assignment Success',
  props<{ assignmentId: string }>()
);

export const deleteAssignmentFailure = createAction(
  '[Assignments] Delete Assignment Failure',
  props<{ error: string; assignmentId: string; assignment: Assignment }>()
);

export const deleteAssignmentRollback = createAction(
  '[Assignments] Delete Assignment Rollback',
  props<{ assignment: Assignment }>()
);

// Invalidate assignments for a location
export const invalidateAssignments = createAction(
  '[Assignments] Invalidate Assignments',
  props<{ locationId: string }>()
);