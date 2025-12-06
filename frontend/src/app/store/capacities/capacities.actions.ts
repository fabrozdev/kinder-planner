import { createAction, props } from '@ngrx/store';
import { Capacity, CreatePlanningCapacity } from '../../shared/models/capacity';
import { DayOfWeekEnum } from '../../shared/models/day-of-week';

export const updateDraftCapacity = createAction(
  '[Capacities] Update Draft Capacity',
  props<{ dayOfWeek: DayOfWeekEnum; maxChildren: number }>(),
);

export const resetDraftCapacities = createAction(
  '[Capacities] Reset Draft Capacities',
);

export const createCapacitiesByPlanningId = createAction(
  '[Capacities] Create Capacities By Planning Id',
  props<{ dto: CreatePlanningCapacity }>(),
);

export const createCapacitiesByPlanningIdSuccess = createAction(
  '[Capacities] Create Capacities By Planning Id Success',
  props<{ capacities: Capacity[]; planningId: string; locationId: string }>(),
);

export const createCapacitiesByPlanningIdFailure = createAction(
  '[Capacities] Create Capacities By Planning Id Failure',
  props<{ error: string }>(),
);