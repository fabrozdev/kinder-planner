import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChildrenState, childrenAdapter } from './children.state';

export const selectChildrenState = createFeatureSelector<ChildrenState>('children');

const childrenSelectors = childrenAdapter.getSelectors(selectChildrenState);

export const selectAllChildren = childrenSelectors.selectAll;
export const selectChildEntities = childrenSelectors.selectEntities;
export const selectChildIds = childrenSelectors.selectIds;
export const selectTotal = childrenSelectors.selectTotal;

export const selectChildrenLoading = createSelector(selectChildrenState, (state) => state.loading);

export const selectChildrenLoaded = createSelector(selectChildrenState, (state) => state.loaded);

export const selectChildrenError = createSelector(selectChildrenState, (state) => state.error);

export const selectChildById = (id: string) =>
  createSelector(selectChildEntities, (entities) => entities[id]);
