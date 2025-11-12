import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChildrenState, childrenAdapter } from './children.state';

export const selectChildrenState =
  createFeatureSelector<ChildrenState>('children');

const { selectAll, selectEntities, selectIds, selectTotal } =
  childrenAdapter.getSelectors();

export const selectAllChildren = createSelector(
  selectChildrenState,
  selectAll
);

export const selectChildEntities = createSelector(
  selectChildrenState,
  selectEntities
);

export const selectChildIds = createSelector(selectChildrenState, selectIds);

export const selectChildrenLoading = createSelector(
  selectChildrenState,
  (state) => state.loading
);

export const selectChildrenLoaded = createSelector(
  selectChildrenState,
  (state) => state.loaded
);

export const selectChildrenError = createSelector(
  selectChildrenState,
  (state) => state.error
);

export const selectChildById = (id: string) =>
  createSelector(selectChildEntities, (entities) => entities[id]);