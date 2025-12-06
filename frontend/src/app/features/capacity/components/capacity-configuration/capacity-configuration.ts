import { Component, computed, inject } from '@angular/core';
import { Divider } from 'primeng/divider';
import { DayOfWeek, DayOfWeekEnum } from '@/app/shared/models/day-of-week';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { selectDraftCapacities, updateDraftCapacity } from '@/app/store/capacities';

@Component({
  selector: 'app-capacity-configuration',
  imports: [Divider, ButtonModule],
  templateUrl: './capacity-configuration.html',
  standalone: true,
})
export class CapacityConfiguration {
  private store = inject(Store);

  draftCapacities = this.store.selectSignal(selectDraftCapacities);

  daysOfWeek = computed<Omit<DayOfWeek, 'assignments'>[]>(() => {
    const capacities = this.draftCapacities();
    return [
      {
        key: DayOfWeekEnum.MON,
        label: 'Monday',
        short: 'Mon',
        capacity: { max: capacities[DayOfWeekEnum.MON] },
      },
      {
        key: DayOfWeekEnum.TUE,
        label: 'Tuesday',
        short: 'Tue',
        capacity: { max: capacities[DayOfWeekEnum.TUE] },
      },
      {
        key: DayOfWeekEnum.WED,
        label: 'Wednesday',
        short: 'Wed',
        capacity: { max: capacities[DayOfWeekEnum.WED] },
      },
      {
        key: DayOfWeekEnum.THU,
        label: 'Thursday',
        short: 'Thu',
        capacity: { max: capacities[DayOfWeekEnum.THU] },
      },
      {
        key: DayOfWeekEnum.FRI,
        label: 'Friday',
        short: 'Fri',
        capacity: { max: capacities[DayOfWeekEnum.FRI] },
      },
    ];
  });

  add(day: DayOfWeekEnum) {
    const currentMax = this.draftCapacities()[day];
    this.store.dispatch(
      updateDraftCapacity({
        dayOfWeek: day,
        maxChildren: currentMax + 1,
      }),
    );
  }

  remove(day: DayOfWeekEnum) {
    const currentMax = this.draftCapacities()[day];
    this.store.dispatch(
      updateDraftCapacity({
        dayOfWeek: day,
        maxChildren: Math.max(0, currentMax - 1),
      }),
    );
  }
}
