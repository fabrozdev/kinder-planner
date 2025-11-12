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
import { selectAllAssignments } from '@/app/store/assignments';
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

  location = input.required<Location>();

  private allAssignments = toSignal(this.store.select(selectAllAssignments), { initialValue: [] });

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

  readonly loading = toSignal(this.store.select(selectPlanningsLoading), { initialValue: false });

  constructor() {
    effect(() => {
      const location = this.location();

      if (location) {
        this.store.dispatch(loadPlanning({ locationId: location.id, month: 11, year: 2025 }));
      }
    });
  }
}
