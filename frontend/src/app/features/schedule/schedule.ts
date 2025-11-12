import { Component, computed, effect, inject, input } from '@angular/core';
import { Day } from '@/app/features/day/day';
import { Location } from '@/app/shared/models/location';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Capacity } from '@/app/features/capacity/capacity';
import { DayOfWeek, WEEKDAY } from '@/app/shared/models/day-of-week';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { loadPlanning, selectPlanningsLoading } from '@/app/store/plannings';
import { selectAssignmentsByLocation } from '@/app/store/assignments';
import { Assignment } from '@/app/shared/models/assignment';

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
  private readonly store = inject(Store);

  // Use input signal instead of @Input
  location = input.required<Location>();

  // Get assignments for this location from store
  private assignmentsForLocation = computed(() => {
    const locationId = this.location().id;
    const assignments = toSignal(
      this.store.select(selectAssignmentsByLocation(locationId)),
      { initialValue: [] }
    )();
    return assignments;
  });

  // Computed signal for this location's days
  daysOfWeek = computed<DayOfWeek[]>(() => {
    const assignments = this.assignmentsForLocation();

    // Group assignments by day of week
    const dayMap = new Map<number, Assignment[]>();
    assignments.forEach((assignment) => {
      if (!dayMap.has(assignment.dayOfWeek)) {
        dayMap.set(assignment.dayOfWeek, []);
      }
      dayMap.get(assignment.dayOfWeek)!.push(assignment);
    });

    // Create DayOfWeek array with assignments
    return WEEKDAY.map((day, index) => ({
      ...day,
      assignments: (dayMap.get(index) || []).sort((a, b) =>
        a.child.firstName.localeCompare(b.child.firstName)
      ),
    }));
  });

  // Use plannings loading state from NgRx store
  readonly loading = toSignal(this.store.select(selectPlanningsLoading), { initialValue: false });

  constructor() {
    // Effect to load planning data for this location
    effect(() => {
      const location = this.location();

      if (location) {
        // Dispatch action to load planning and assignments
        this.store.dispatch(
          loadPlanning({ locationId: location.id, month: 11, year: 2025 })
        );
      }
    });
  }
}
