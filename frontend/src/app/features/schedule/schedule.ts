import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { Day } from '@/app/features/day/day';
import { Location } from '@/app/shared/models/location';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Capacity } from '@/app/features/capacity/capacity';
import { PlanningStateService } from '@/app/services/planning-state.service';
import { DayOfWeek } from '@/app/shared/models/day-of-week';

@Component({
  selector: 'app-schedule',
  imports: [
    Day,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatIconButton,
    Capacity,
  ],
  templateUrl: './schedule.html',
})
export class Schedule {
  private readonly stateService = inject(PlanningStateService);

  // Use input signal instead of @Input
  location = input.required<Location>();

  // Computed signal for this location's days
  daysOfWeek = computed<DayOfWeek[]>(() => {
    const locationId = this.location().id;
    const assignmentsByLocationAndDay = this.stateService.assignmentsByLocationAndDay();

    return (
      assignmentsByLocationAndDay.get(locationId) || [
        { key: 'MON', label: 'Monday', short: 'Mon', capability: { max: 10 }, assignments: [] },
        { key: 'TUE', label: 'Tuesday', short: 'Tue', capability: { max: 10 }, assignments: [] },
        { key: 'WED', label: 'Wednesday', short: 'Wed', capability: { max: 10 }, assignments: [] },
        { key: 'THU', label: 'Thursday', short: 'Thu', capability: { max: 10 }, assignments: [] },
        { key: 'FRI', label: 'Friday', short: 'Fri', capability: { max: 10 }, assignments: [] },
      ]
    );
  });

  // Expose loading state
  readonly loading = this.stateService.loading;

  constructor() {
    // Effect to load planning data for this location
    // This won't create a loop because loadPlanning has its own caching
    effect(() => {
      const location = this.location();

      if (location) {
        this.stateService.loadPlanning(location.id);
      }
    });
  }
}
