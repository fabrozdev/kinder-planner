import { createAction, props } from '@ngrx/store';
import { Location } from '../../shared/models/location';

export const loadLocations = createAction('[Locations] Load Locations');

export const loadLocationsSuccess = createAction(
  '[Locations] Load Locations Success',
  props<{ locations: Location[] }>()
);

export const loadLocationsFailure = createAction(
  '[Locations] Load Locations Failure',
  props<{ error: string }>()
);