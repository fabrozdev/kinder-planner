import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LocationsState, locationsAdapter } from './locations.state';

export const selectLocationsState = createFeatureSelector<LocationsState>('locations');

const locationsSelectors = locationsAdapter.getSelectors(selectLocationsState);

export const selectAllLocations = locationsSelectors.selectAll;
export const selectLocationEntities = locationsSelectors.selectEntities;
export const selectLocationIds = locationsSelectors.selectIds;
export const selectTotal = locationsSelectors.selectTotal;

export const selectLocationsLoading = createSelector(
  selectLocationsState,
  (state) => state.loading,
);

export const selectLocationsError = createSelector(selectLocationsState, (state) => state.error);

export const selectLocationById = (id: string) =>
  createSelector(selectLocationEntities, (entities) => entities[id]);
