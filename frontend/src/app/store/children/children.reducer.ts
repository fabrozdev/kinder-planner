import { createReducer, on } from '@ngrx/store';
import * as ChildrenActions from './children.actions';
import {
  initialChildrenState,
  childrenAdapter,
  ChildrenState,
} from './children.state';

export const childrenReducer = createReducer(
  initialChildrenState,
  on(ChildrenActions.loadChildren, (state): ChildrenState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    ChildrenActions.loadChildrenSuccess,
    (state, { children }): ChildrenState =>
      childrenAdapter.setAll(children, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      })
  ),
  on(
    ChildrenActions.loadChildrenFailure,
    (state, { error }): ChildrenState => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(ChildrenActions.invalidateChildren, (state): ChildrenState =>
    childrenAdapter.removeAll({
      ...state,
      loaded: false,
    })
  )
);