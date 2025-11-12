import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Assignment } from '../../shared/models/assignment';

export interface AssignmentsState extends EntityState<Assignment> {
  loading: boolean;
  loadingByLocation: { [locationId: string]: boolean };
  loadedLocations: Set<string>;
  error: string | null;
}

export const assignmentsAdapter: EntityAdapter<Assignment> =
  createEntityAdapter<Assignment>({
    selectId: (assignment: Assignment) => assignment.id,
  });

export const initialAssignmentsState: AssignmentsState =
  assignmentsAdapter.getInitialState({
    loading: false,
    loadingByLocation: {},
    loadedLocations: new Set<string>(),
    error: null,
  });