import { Component, inject, signal } from '@angular/core';
import { Schedule } from '../schedule/schedule';
import { PlannerSkeleton } from './components/planner-skeleton/planner-skeleton';
import { PlannerNavigator } from './components/planner-navigator/planner-navigator';
import { Header } from '../../components/header/header';
import { PlannerService } from '../../services/planner.service';
import { Planning } from '../../shared/models/planning';
import { concatMap, tap } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Location } from '../../shared/models/location';

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
