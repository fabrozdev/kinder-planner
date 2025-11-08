import { Component, inject } from '@angular/core';
import { Schedule } from '@/app/features/schedule/schedule';
import { PlannerSkeleton } from '@/app/features/planner/components/planner-skeleton/planner-skeleton';
import { Header } from '@/app/components/header/header';
import { PlanningStateService } from '@/app/services/planning-state.service';

@Component({
  selector: 'app-planner',
  imports: [Schedule, PlannerSkeleton, Header],
  templateUrl: './planner.html',
})
export class Planner {
  private readonly stateService = inject(PlanningStateService);

  // Expose state from service
  readonly loading = this.stateService.loading;
  readonly planning = this.stateService.planning;
  readonly locations = this.stateService.locations;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.stateService.loadPlanning();
    this.stateService.loadLocations();
    this.stateService.loadChildren();
  }
}
