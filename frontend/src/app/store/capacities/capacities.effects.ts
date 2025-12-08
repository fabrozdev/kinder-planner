import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as CapacitiesActions from './capacities.actions';
import { MessageService } from 'primeng/api';
import { PlannerService } from '@/app/services/planner.service';

@Injectable()
export class CapacitiesEffects {
  private actions$ = inject(Actions);
  private planningService = inject(PlannerService);
  private messageService = inject(MessageService);

  loadCapacitiesByPlanningAndLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CapacitiesActions.loadCapacitiesByPlanningAndLocation),
      switchMap(({ planningId, locationId }) =>
        this.planningService.getPlanningCapacityByLocationId(planningId, locationId).pipe(
          map((capacities) =>
            CapacitiesActions.loadCapacitiesByPlanningAndLocationSuccess({
              capacities: capacities as unknown as Record<any, any>,
              planningId,
              locationId,
            }),
          ),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load capacities',
            });
            return of(
              CapacitiesActions.loadCapacitiesByPlanningAndLocationFailure({
                error: error.message || 'Failed to load capacities',
              }),
            );
          }),
        ),
      ),
    ),
  );

  createCapacitiesByPlanningId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CapacitiesActions.createCapacitiesByPlanningId),
      switchMap(({ dto }) =>
        this.planningService.upsertPlanningCapacity(dto).pipe(
          map((capacities) =>
            CapacitiesActions.createCapacitiesByPlanningIdSuccess({
              capacities,
              planningId: dto.planningId,
              locationId: dto.locationId,
            }),
          ),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create capacities',
            });
            return of(
              CapacitiesActions.createCapacitiesByPlanningIdFailure({
                error: error.message || 'Failed to create capacities',
              }),
            );
          }),
        ),
      ),
    ),
  );

  createCapacitiesByPlanningIdSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CapacitiesActions.createCapacitiesByPlanningIdSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Capacities created successfully',
          });
        }),
      ),
    { dispatch: false },
  );
}
