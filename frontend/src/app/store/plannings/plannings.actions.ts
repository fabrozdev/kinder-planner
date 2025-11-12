import { createAction, props } from '@ngrx/store';
import { PlanningWithAssignment } from '../../shared/models/planning';

export const loadPlanning = createAction(
  '[Plannings] Load Planning',
  props<{ locationId: string; month: number; year: number }>()
);

export const loadPlanningSuccess = createAction(
  '[Plannings] Load Planning Success',
  props<{ planning: PlanningWithAssignment; locationId: string }>()
);

export const loadPlanningFailure = createAction(
  '[Plannings] Load Planning Failure',
  props<{ error: string; locationId: string }>()
);

export const invalidatePlanning = createAction(
  '[Plannings] Invalidate Planning',
  props<{ locationId: string }>()
);