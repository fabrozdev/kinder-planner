import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  withLatestFrom,
  filter,
} from 'rxjs/operators';
import * as ChildrenActions from './children.actions';
import { ChildrenService } from '../../services/children.service';
import { selectChildrenLoaded } from './children.selectors';

@Injectable()
export class ChildrenEffects {
  private actions$ = inject(Actions);
  private childrenService = inject(ChildrenService);
  private store = inject(Store);

  loadChildren$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildrenActions.loadChildren),
      withLatestFrom(this.store.select(selectChildrenLoaded)),
      filter(([, loaded]) => !loaded),
      switchMap(() =>
        this.childrenService.getChildren().pipe(
          map((children) =>
            ChildrenActions.loadChildrenSuccess({ children })
          ),
          catchError((error) =>
            of(
              ChildrenActions.loadChildrenFailure({
                error: error.message || 'Failed to load children',
              })
            )
          )
        )
      )
    )
  );

  invalidateChildren$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildrenActions.invalidateChildren),
      map(() => ChildrenActions.loadChildren())
    )
  );
}