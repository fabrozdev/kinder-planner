import { createReducer, on } from '@ngrx/store';
import * as AssignmentsActions from './assignments.actions';
import {
  initialAssignmentsState,
  assignmentsAdapter,
  AssignmentsState,
} from './assignments.state';

export const assignmentsReducer = createReducer(
  initialAssignmentsState,
  on(
    AssignmentsActions.loadAssignments,
    (state, { locationId }): AssignmentsState => ({
      ...state,
      loading: true,
      loadingByLocation: {
        ...state.loadingByLocation,
        [locationId]: true,
      },
      error: null,
    })
  ),
  on(
    AssignmentsActions.loadAssignmentsSuccess,
    (state, { assignments, locationId }): AssignmentsState => {
      const loadedLocations = new Set(state.loadedLocations);
      loadedLocations.add(locationId);

      return assignmentsAdapter.upsertMany(assignments, {
        ...state,
        loading: false,
        loadingByLocation: {
          ...state.loadingByLocation,
          [locationId]: false,
        },
        loadedLocations,
        error: null,
      });
    }
  ),
  on(
    AssignmentsActions.loadAssignmentsFailure,
    (state, { error, locationId }): AssignmentsState => ({
      ...state,
      loading: false,
      loadingByLocation: {
        ...state.loadingByLocation,
        [locationId]: false,
      },
      error,
    })
  ),
  on(
    AssignmentsActions.createAssignment,
    (state, { dto, tempId }): AssignmentsState => {
      const tempAssignment: any = {
        id: tempId,
        ...dto,
        child: { id: dto.childId, firstName: '', lastName: '', group: '' },
      };

      return assignmentsAdapter.addOne(tempAssignment, state);
    }
  ),
  on(
    AssignmentsActions.createAssignmentSuccess,
    (state, { assignment, tempId }): AssignmentsState => {
      return assignmentsAdapter.updateOne(
        {
          id: tempId,
          changes: assignment,
        },
        state
      );
    }
  ),
  on(
    AssignmentsActions.createAssignmentRollback,
    (state, { tempId }): AssignmentsState => {
      return assignmentsAdapter.removeOne(tempId, state);
    }
  ),

  on(
    AssignmentsActions.deleteAssignment,
    (state, { assignmentId }): AssignmentsState => {
      return assignmentsAdapter.removeOne(assignmentId, state);
    }
  ),
  on(
    AssignmentsActions.deleteAssignmentSuccess,
    (state): AssignmentsState => {
      return state;
    }
  ),
  on(
    AssignmentsActions.deleteAssignmentRollback,
    (state, { assignment }): AssignmentsState => {
      return assignmentsAdapter.addOne(assignment, state);
    }
  ),
  on(
    AssignmentsActions.invalidateAssignments,
    (state, { locationId }): AssignmentsState => {
      const loadedLocations = new Set(state.loadedLocations);
      loadedLocations.delete(locationId);

      const assignmentsToRemove = Object.values(state.entities)
        .filter((a) => a?.locationId === locationId)
        .map((a) => a!.id);

      return assignmentsAdapter.removeMany(assignmentsToRemove, {
        ...state,
        loadedLocations,
      });
    }
  )
);