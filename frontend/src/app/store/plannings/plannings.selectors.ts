import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlanningsState, planningsAdapter } from './plannings.state';

export const selectPlanningsState = createFeatureSelector<PlanningsState>('plannings');

const planningsSelectors = planningsAdapter.getSelectors(selectPlanningsState);

export const selectAllPlannings = planningsSelectors.selectAll;
export const selectPlanningEntities = planningsSelectors.selectEntities;
export const selectPlanningIds = planningsSelectors.selectIds;
export const selectTotal = planningsSelectors.selectTotal;

export const selectPlanningsLoading = createSelector(
  selectPlanningsState,
  (state) => state.loading,
);

export const selectPlanningsError = createSelector(selectPlanningsState, (state) => state.error);

export const selectPlanningById = (id: string) =>
  createSelector(selectPlanningEntities, (entities) => entities[id]);

export const selectPlanningByLocation = (locationId: string) =>
  createSelector(selectAllPlannings, (plannings) =>
    plannings.find((p) => p.locationId === locationId),
  );

export const selectPlanningLoadedForLocation = (locationId: string) =>
  createSelector(selectPlanningsState, (state) => state.loadedLocationKeys.has(locationId));

export const selectPlanningLoadingForLocation = (locationId: string) =>
  createSelector(selectPlanningsState, (state) => state.loadingByLocation[locationId] || false);
