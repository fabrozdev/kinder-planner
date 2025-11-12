import { createAction, props } from '@ngrx/store';
import { Child } from '../../shared/models/child';

export const loadChildren = createAction('[Children] Load Children');

export const loadChildrenSuccess = createAction(
  '[Children] Load Children Success',
  props<{ children: Child[] }>()
);

export const loadChildrenFailure = createAction(
  '[Children] Load Children Failure',
  props<{ error: string }>()
);

export const invalidateChildren = createAction('[Children] Invalidate Children');