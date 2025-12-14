import { Component, computed, effect, inject, input } from '@angular/core';
import { Day } from '@/app/features/day/day';
import { Location } from '@/app/shared/models/location';
import { Capacity } from '@/app/features/capacity/capacity';
import { DayOfWeek, WEEKDAY } from '@/app/shared/models/day-of-week';
import { Store } from '@ngrx/store';
import {
  loadPlanning,
  selectPlanningByLocation,
  selectPlanningLoadingForLocation,
} from '@/app/store/plannings';
import { selectAllAssignments } from '@/app/store/assignments';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { groupAssignmentsByDay, sortAssignmentsByChildName } from '@/app/features/schedule/utils';
import { ScheduleSkeleton } from '@/app/features/schedule/components/schedule-skeleton/schedule-skeleton';

@Component({
  selector: 'app-schedule',
  imports: [Day, Capacity, ButtonModule, CardModule, SkeletonModule, ScheduleSkeleton],
  templateUrl: './schedule.html',
})
export class Schedule {
  private readonly store = inject(Store);

  location = input.required<Location>();

  private allAssignments = this.store.selectSignal(selectAllAssignments);

  planning = computed(() => {
    const locationId = this.location().id;
    return this.store.selectSignal(selectPlanningByLocation(locationId))();
  });

  daysOfWeek = computed<DayOfWeek[]>(() => {
    const locationId = this.location().id;
    const allAssignments = this.allAssignments();
    const weekCapacity = this.planning()?.weekCapacity;

    const assignments = allAssignments.filter((a) => a.locationId === locationId);

    const dayMap = groupAssignmentsByDay(assignments);

    return WEEKDAY.map((day, index) => ({
      ...day,
      assignments: sortAssignmentsByChildName(dayMap.get(index) ?? []),
      capacity: { max: weekCapacity?.[day.key].maxChildren ?? 10 },
    }));
  });

  readonly loading = computed(() => {
    const locationId = this.location().id;
    return this.store.selectSignal(selectPlanningLoadingForLocation(locationId))();
  });

  constructor() {
    effect(() => {
      const location = this.location();
      const date = new Date();
      if (location) {
        this.store.dispatch(
          loadPlanning({
            locationId: location.id,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          }),
        );
      }
    });
  }
}
