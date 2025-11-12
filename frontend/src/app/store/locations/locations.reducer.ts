import { createReducer, on } from '@ngrx/store';
import * as LocationsActions from './locations.actions';
import {
  initialLocationsState,
  locationsAdapter,
  LocationsState,
} from './locations.state';

export const locationsReducer = createReducer(
  initialLocationsState,
  on(LocationsActions.loadLocations, (state): LocationsState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    LocationsActions.loadLocationsSuccess,
    (state, { locations }): LocationsState =>
      locationsAdapter.setAll(locations, {
        ...state,
        loading: false,
        error: null,
      })
  ),
  on(
    LocationsActions.loadLocationsFailure,
    (state, { error }): LocationsState => ({
      ...state,
      loading: false,
      error,
    })
  )
);
