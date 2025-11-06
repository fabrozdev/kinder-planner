import { Component, inject, signal } from '@angular/core';
import { concatMap, tap } from 'rxjs';
import { Schedule } from '@/app/features/schedule/schedule';
import { LocationService } from '@/app/services/location.service';
import { Planning } from '@/app/shared/models/planning';
import { PlannerService } from '@/app/services/planner.service';
import { PlannerSkeleton } from '@/app/features/planner/components/planner-skeleton/planner-skeleton';
import { PlannerNavigator } from '@/app/features/planner/components/planner-navigator/planner-navigator';
import { Header } from '@/app/components/header/header';
import { Location } from '@/app/shared/models/location';

@Component({
  selector: 'app-planner',
  imports: [Schedule, PlannerSkeleton, PlannerNavigator, Header],
  templateUrl: './planner.html',
})
export class Planner {
  private readonly plannerService = inject(PlannerService);
  private readonly locationService = inject(LocationService);

  loading = signal(false);
  planning = signal<Planning | null>(null);
  locations = signal<Location[] | null>(null);

  constructor() {
    this.loading.set(true);
    this.initialize();
  }

  private initialize() {
    this.plannerService
      .getPlanning()
      .pipe(
        tap((planning) => {
          console.log('Planning data:', planning);
          this.planning.set(planning);
        }),
        concatMap(() => this.locationService.getLocations()),
      )
      .subscribe({
        next: (locations) => {
          console.log('Locations data:', locations);
          this.locations.set(locations);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.loading.set(false);
        },
      });
  }
}
