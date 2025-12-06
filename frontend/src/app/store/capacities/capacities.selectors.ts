import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CapacitiesState, capacitiesAdapter } from './capacities.state';

export const selectCapacitiesState =
  createFeatureSelector<CapacitiesState>('capacities');

export const {
  selectIds: selectCapacityIds,
  selectEntities: selectCapacityEntities,
  selectAll: selectAllCapacities,
  selectTotal: selectCapacitiesTotal,
} = capacitiesAdapter.getSelectors(selectCapacitiesState);

export const selectCapacitiesLoading = createSelector(
  selectCapacitiesState,
  (state) => state.loading
);

export const selectCapacitiesError = createSelector(
  selectCapacitiesState,
  (state) => state.error
);

export const selectDraftCapacities = createSelector(
  selectCapacitiesState,
  (state) => state.draftCapacities
);

export const selectCapacitiesByPlanningAndLocation = (
  planningId: string,
  locationId: string
) =>
  createSelector(selectAllCapacities, (capacities) =>
    capacities.filter(
      (c) => c.planningId === planningId && c.locationId === locationId
    )
  );

export const selectCapacitiesLoadingByPlanningLocation = (
  planningId: string,
  locationId: string
) =>
  createSelector(
    selectCapacitiesState,
    (state) => state.loadingByPlanningLocation[`${planningId}-${locationId}`] ?? false
  );