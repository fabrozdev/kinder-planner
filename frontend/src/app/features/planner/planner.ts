import { Component, computed, inject } from '@angular/core';
import { Schedule } from '@/app/features/schedule/schedule';
import { PlannerSkeleton } from '@/app/features/planner/components/planner-skeleton/planner-skeleton';
import { Header } from '@/app/components/header/header';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { loadLocations, selectAllLocations, selectLocationsLoading } from '@/app/store/locations';
import { loadChildren, selectChildrenLoading } from '@/app/store/children';

@Component({
  selector: 'app-planner',
  imports: [Schedule, PlannerSkeleton, Header],
  templateUrl: './planner.html',
})
export class Planner {
  private readonly store = inject(Store);

  readonly locations = toSignal(this.store.select(selectAllLocations), { initialValue: [] });
  readonly locationsLoading = toSignal(this.store.select(selectLocationsLoading), { initialValue: false });
  readonly childrenLoading = toSignal(this.store.select(selectChildrenLoading), { initialValue: false });

  readonly loading = computed(() => this.locationsLoading() || this.childrenLoading());

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.store.dispatch(loadLocations());
    this.store.dispatch(loadChildren());
  }
}
