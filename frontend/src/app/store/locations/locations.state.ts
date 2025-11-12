import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Location } from '../../shared/models/location';

export interface LocationsState extends EntityState<Location> {
  loading: boolean;
  error: string | null;
}

export const locationsAdapter: EntityAdapter<Location> =
  createEntityAdapter<Location>({
    selectId: (location: Location) => location.id,
  });

export const initialLocationsState: LocationsState =
  locationsAdapter.getInitialState({
    loading: false,
    error: null,
  });