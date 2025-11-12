import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as LocationsActions from './locations.actions';
import { LocationService } from '../../services/location.service';

@Injectable()
export class LocationsEffects {
  private actions$ = inject(Actions);
  private locationService = inject(LocationService);

  loadLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.loadLocations),
      switchMap(() =>
        this.locationService.getLocations().pipe(
          map((locations) =>
            LocationsActions.loadLocationsSuccess({ locations })
          ),
          catchError((error) =>
            of(
              LocationsActions.loadLocationsFailure({
                error: error.message || 'Failed to load locations',
              })
            )
          )
        )
      )
    )
  );
}