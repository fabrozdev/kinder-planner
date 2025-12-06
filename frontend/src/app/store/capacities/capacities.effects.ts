import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as CapacitiesActions from './capacities.actions';
import { CapacitiesService } from '../../services/capacities.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class CapacitiesEffects {
  private actions$ = inject(Actions);
  private capacitiesService = inject(CapacitiesService);
  private messageService = inject(MessageService);

  loadCapacitiesByPlanningAndLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CapacitiesActions.loadCapacitiesByPlanningAndLocation),
      switchMap(({ planningId, locationId }) =>
        this.capacitiesService.getCapacitiesOfWeekByPlanningAndLocationId(planningId, locationId).pipe(
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
        this.capacitiesService.upsertCapacitiesByPlanningId(dto).pipe(
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
