import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, take } from 'rxjs/operators';
import * as CapacitiesActions from './capacities.actions';
import * as PlanningsActions from '../plannings/plannings.actions';
import { selectPlanningById } from '@/app/store/plannings';
import { MessageService } from 'primeng/api';
import { PlannerService } from '@/app/services/planner.service';

@Injectable()
export class CapacitiesEffects {
  private actions$ = inject(Actions);
  private planningService = inject(PlannerService);
  private messageService = inject(MessageService);
  private store = inject(Store);

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

  createCapacitiesByPlanningIdSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CapacitiesActions.createCapacitiesByPlanningIdSuccess),
      concatMap((action) =>
        this.store.select(selectPlanningById(action.planningId)).pipe(
          take(1),
          map((planning) => ({ action, planning })),
        ),
      ),
      concatMap(({ action, planning }) => {
        const { locationId } = action;

        const actions: any[] = [
          // Invalidate the planning to allow refetching
          PlanningsActions.invalidatePlanning({ locationId }),
        ];

        // If we have the planning data, dispatch loadPlanning to refetch
        if (planning) {
          actions.push(
            PlanningsActions.loadPlanning({
              locationId,
              month: planning.month,
              year: planning.year,
            }),
          );
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Capacities created successfully',
        });

        return actions;
      }),
    ),
  );
}
