import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, withLatestFrom, filter, mergeMap } from 'rxjs/operators';
import * as PlanningsActions from './plannings.actions';
import * as AssignmentsActions from '../assignments/assignments.actions';
import { PlannerService } from '../../services/planner.service';
import { selectPlanningLoadedForLocation } from './plannings.selectors';

@Injectable()
export class PlanningsEffects {
  private actions$ = inject(Actions);
  private plannerService = inject(PlannerService);
  private store = inject(Store);

  loadPlanning$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningsActions.loadPlanning),
      withLatestFrom(
        this.actions$.pipe(
          map((action: any) => {
            if (action.type === PlanningsActions.loadPlanning.type) {
              return action.locationId;
            }
            return null;
          })
        )
      ),
      mergeMap(([action, _]) => {
        const { locationId, month, year } = action;

        let isLoaded = false;
        this.store
          .select(selectPlanningLoadedForLocation(locationId))
          .subscribe((loaded) => (isLoaded = loaded))
          .unsubscribe();

        if (isLoaded) {
          return of({ type: 'NO_OP' });
        }

        return this.plannerService
          .getPlanningByMonthAndYearAndLocationId(month, year, locationId)
          .pipe(
            mergeMap((planning) => [
              PlanningsActions.loadPlanningSuccess({
                planning,
                locationId,
              }),
              AssignmentsActions.loadAssignmentsSuccess({
                assignments: planning.assignments,
                locationId,
              }),
            ]),
            catchError((error) =>
              of(
                PlanningsActions.loadPlanningFailure({
                  error: error.message || 'Failed to load planning',
                  locationId,
                })
              )
            )
          );
      }),
      filter((action: any) => action.type !== 'NO_OP')
    )
  );

  invalidatePlanning$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanningsActions.invalidatePlanning),
      mergeMap(({ locationId }) => [
        AssignmentsActions.invalidateAssignments({ locationId }),
      ])
    )
  );
}
