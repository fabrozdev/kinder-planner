import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LocationsState, locationsAdapter } from './locations.state';

export const selectLocationsState =
  createFeatureSelector<LocationsState>('locations');

const { selectAll, selectEntities, selectIds, selectTotal } =
  locationsAdapter.getSelectors();

export const selectAllLocations = createSelector(
  selectLocationsState,
  selectAll
);

export const selectLocationEntities = createSelector(
  selectLocationsState,
  selectEntities
);

export const selectLocationIds = createSelector(selectLocationsState, selectIds);

export const selectLocationsLoading = createSelector(
  selectLocationsState,
  (state) => state.loading
);

export const selectLocationsError = createSelector(
  selectLocationsState,
  (state) => state.error
);

export const selectLocationById = (id: string) =>
  createSelector(selectLocationEntities, (entities) => entities[id]);