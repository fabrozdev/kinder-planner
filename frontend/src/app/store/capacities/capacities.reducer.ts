import { createReducer, on } from '@ngrx/store';
import * as CapacitiesActions from './capacities.actions';
import {
  initialCapacitiesState,
  capacitiesAdapter,
  CapacitiesState,
} from './capacities.state';

export const capacitiesReducer = createReducer(
  initialCapacitiesState,
  on(
    CapacitiesActions.updateDraftCapacity,
    (state, { dayOfWeek, maxChildren }): CapacitiesState => ({
      ...state,
      draftCapacities: {
        ...state.draftCapacities,
        [dayOfWeek]: maxChildren,
      },
    })
  ),
  on(
    CapacitiesActions.resetDraftCapacities,
    (state): CapacitiesState => ({
      ...state,
      draftCapacities: {
        ...initialCapacitiesState.draftCapacities,
      },
    })
  ),
  on(
    CapacitiesActions.createCapacitiesByPlanningId,
    (state, { dto }): CapacitiesState => {
      const key = `${dto.planningId}-${dto.locationId}`;
      return {
        ...state,
        loading: true,
        loadingByPlanningLocation: {
          ...state.loadingByPlanningLocation,
          [key]: true,
        },
        error: null,
      };
    }
  ),
  on(
    CapacitiesActions.createCapacitiesByPlanningIdSuccess,
    (state, { capacities, planningId, locationId }): CapacitiesState => {
      const key = `${planningId}-${locationId}`;
      const loadedPlanningLocationKeys = new Set(state.loadedPlanningLocationKeys);
      loadedPlanningLocationKeys.add(key);

      return capacitiesAdapter.upsertMany(capacities, {
        ...state,
        loading: false,
        loadingByPlanningLocation: {
          ...state.loadingByPlanningLocation,
          [key]: false,
        },
        loadedPlanningLocationKeys,
        error: null,
      });
    }
  ),
  on(
    CapacitiesActions.createCapacitiesByPlanningIdFailure,
    (state, { error }): CapacitiesState => ({
      ...state,
      loading: false,
      error,
    })
  )
);