import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import * as AssignmentsActions from './assignments.actions';
import { AssignmentService } from '../../services/assignment.service';
import { selectAssignmentById } from './assignments.selectors';

@Injectable()
export class AssignmentsEffects {
  private actions$ = inject(Actions);
  private assignmentService = inject(AssignmentService);
  private store = inject(Store);

  createAssignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssignmentsActions.createAssignment),
      switchMap(({ dto, tempId }) =>
        this.assignmentService.createAssignment(dto).pipe(
          map((assignment) =>
            AssignmentsActions.createAssignmentSuccess({ assignment, tempId })
          ),
          catchError((error) => {
            return of(
              AssignmentsActions.createAssignmentRollback({ tempId }),
              AssignmentsActions.createAssignmentFailure({
                error: error.message || 'Failed to create assignment',
                tempId,
              })
            );
          })
        )
      )
    )
  );

  deleteAssignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssignmentsActions.deleteAssignment),
      withLatestFrom(
        this.actions$.pipe(
          map((action: any) => {
            if (action.type === AssignmentsActions.deleteAssignment.type) {
              return action.assignmentId;
            }
            return null;
          })
        )
      ),
      switchMap(([action, _]) => {
        const assignmentId = action.assignmentId;

        let assignmentForRollback: any = null;
        this.store
          .select(selectAssignmentById(assignmentId))
          .subscribe((a) => (assignmentForRollback = a))
          .unsubscribe();

        return this.assignmentService.deleteAssignment(assignmentId).pipe(
          map(() =>
            AssignmentsActions.deleteAssignmentSuccess({ assignmentId })
          ),
          catchError((error) => {
            if (assignmentForRollback) {
              return of(
                AssignmentsActions.deleteAssignmentRollback({
                  assignment: assignmentForRollback,
                }),
                AssignmentsActions.deleteAssignmentFailure({
                  error: error.message || 'Failed to delete assignment',
                  assignmentId,
                  assignment: assignmentForRollback,
                })
              );
            }
            return of(
              AssignmentsActions.deleteAssignmentFailure({
                error: error.message || 'Failed to delete assignment',
                assignmentId,
                assignment: assignmentForRollback!,
              })
            );
          })
        );
      })
    )
  );

  invalidateAssignments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssignmentsActions.invalidateAssignments),
      map(({ locationId }) =>
        AssignmentsActions.loadAssignments({ locationId })
      )
    )
  );
}