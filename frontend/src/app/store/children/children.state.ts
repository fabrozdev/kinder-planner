import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Child } from '../../shared/models/child';

export interface ChildrenState extends EntityState<Child> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const childrenAdapter: EntityAdapter<Child> = createEntityAdapter<Child>(
  {
    selectId: (child: Child) => child.id,
    sortComparer: (a: Child, b: Child) =>
      a.firstName.localeCompare(b.firstName),
  }
);

export const initialChildrenState: ChildrenState =
  childrenAdapter.getInitialState({
    loading: false,
    loaded: false,
    error: null,
  });