import { Component, computed, effect, inject, input } from '@angular/core';
import { Day } from '@/app/features/day/day';
import { Location } from '@/app/shared/models/location';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Capacity } from '@/app/features/capacity/capacity';
import { DayOfWeek, WEEKDAY } from '@/app/shared/models/day-of-week';
import { Store } from '@ngrx/store';
import { loadPlanning, selectPlanningsLoading } from '@/app/store/plannings';
import { selectAllAssignments } from '@/app/store/assignments';
import { Assignment } from '@/app/shared/models/assignment';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-schedule',
  imports: [
    Day,
    MatIcon,
    MatIconButton,
    Capacity,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './schedule.html',
})
export class Schedule {
  private readonly store = inject(Store);

  location = input.required<Location>();

  private allAssignments = this.store.selectSignal(selectAllAssignments);

  daysOfWeek = computed<DayOfWeek[]>(() => {
    const locationId = this.location().id;
    const allAssignments = this.allAssignments();

    const assignments = allAssignments.filter((a) => a.locationId === locationId);

    const dayMap = new Map<number, Assignment[]>();
    assignments.forEach((assignment) => {
      if (!dayMap.has(assignment.dayOfWeek)) {
        dayMap.set(assignment.dayOfWeek, []);
      }
      dayMap.get(assignment.dayOfWeek)!.push(assignment);
    });

    return WEEKDAY.map((day, index) => ({
      ...day,
      assignments: (dayMap.get(index) || []).sort((a, b) =>
        a.child.firstName.localeCompare(b.child.firstName),
      ),
    }));
  });

  readonly loading = this.store.selectSignal(selectPlanningsLoading);

  constructor() {
    effect(() => {
      const location = this.location();

      if (location) {
        this.store.dispatch(loadPlanning({ locationId: location.id, month: 11, year: 2025 }));
      }
    });
  }
}
