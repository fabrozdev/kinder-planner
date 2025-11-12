import { createReducer, on } from '@ngrx/store';
import * as PlanningsActions from './plannings.actions';
import {
  initialPlanningsState,
  planningsAdapter,
  PlanningsState,
} from './plannings.state';

export const planningsReducer = createReducer(
  initialPlanningsState,

  on(
    PlanningsActions.loadPlanning,
    (state, { locationId }): PlanningsState => ({
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
    PlanningsActions.loadPlanningSuccess,
    (state, { planning, locationId }): PlanningsState => {
      const loadedLocationKeys = new Set(state.loadedLocationKeys);
      loadedLocationKeys.add(locationId);

      return planningsAdapter.upsertOne(planning, {
        ...state,
        loading: false,
        loadingByLocation: {
          ...state.loadingByLocation,
          [locationId]: false,
        },
        loadedLocationKeys,
        error: null,
      });
    }
  ),

  on(
    PlanningsActions.loadPlanningFailure,
    (state, { error, locationId }): PlanningsState => ({
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
    PlanningsActions.invalidatePlanning,
    (state, { locationId }): PlanningsState => {
      const loadedLocationKeys = new Set(state.loadedLocationKeys);
      loadedLocationKeys.delete(locationId);

      // Remove planning for this location
      const planningToRemove = Object.values(state.entities).find(
        (p) => p?.locationId === locationId
      );

      if (planningToRemove) {
        return planningsAdapter.removeOne(planningToRemove.id, {
          ...state,
          loadedLocationKeys,
        });
      }

      return {
        ...state,
        loadedLocationKeys,
      };
    }
  )
);