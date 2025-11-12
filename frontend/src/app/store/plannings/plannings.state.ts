import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Planning } from '../../shared/models/planning';

export interface PlanningsState extends EntityState<Planning> {
  loading: boolean;
  loadingByLocation: { [locationId: string]: boolean };
  loadedLocationKeys: Set<string>;
  error: string | null;
}

export const planningsAdapter: EntityAdapter<Planning> =
  createEntityAdapter<Planning>({
    selectId: (planning: Planning) => planning.id,
  });

export const initialPlanningsState: PlanningsState =
  planningsAdapter.getInitialState({
    loading: false,
    loadingByLocation: {},
    loadedLocationKeys: new Set<string>(),
    error: null,
  });