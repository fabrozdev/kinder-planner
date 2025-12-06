import { Component, input, model, inject, effect, computed } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CapacityConfiguration } from '@/app/features/capacity/components/capacity-configuration/capacity-configuration';
import { Location } from '@/app/shared/models/location';
import { Store } from '@ngrx/store';
import {
  createCapacitiesByPlanningId,
  resetDraftCapacities,
  selectDraftCapacities,
  loadCapacitiesByPlanningAndLocation,
  selectCapacitiesLoadingByPlanningLocation,
} from '@/app/store/capacities';
import { DayOfWeekEnum } from '@/app/shared/models/day-of-week';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-capacity-dialog',
  imports: [Dialog, ButtonModule, CapacityConfiguration, Skeleton],
  templateUrl: './capacity-dialog.html',
  standalone: true,
})
export class CapacityDialog {
  private store = inject(Store);

  location = input.required<Location>();
  planningId = input.required<string>();
  visible = model.required<boolean>();

  private draftCapacities = this.store.selectSignal(selectDraftCapacities);

  loading = computed(() => {
    const planningId = this.planningId();
    const locationId = this.location().id;
    return this.store.selectSignal(
      selectCapacitiesLoadingByPlanningLocation(planningId, locationId),
    )();
  });

  constructor() {
    effect(() => {
      const visible = this.visible();
      const planningId = this.planningId();
      const locationId = this.location().id;

      if (visible) {
        this.store.dispatch(loadCapacitiesByPlanningAndLocation({ planningId, locationId }));
      }
    });
  }

  close() {
    this.store.dispatch(resetDraftCapacities());
    this.visible.set(false);
  }

  save() {
    const capacities = this.draftCapacities();
    const planningCapacity = {
      planningId: this.planningId(),
      locationId: this.location().id,
      capacities: {
        [DayOfWeekEnum.MON]: {
          dayOfWeek: DayOfWeekEnum.MON,
          maxChildren: capacities[DayOfWeekEnum.MON],
        },
        [DayOfWeekEnum.TUE]: {
          dayOfWeek: DayOfWeekEnum.TUE,
          maxChildren: capacities[DayOfWeekEnum.TUE],
        },
        [DayOfWeekEnum.WED]: {
          dayOfWeek: DayOfWeekEnum.WED,
          maxChildren: capacities[DayOfWeekEnum.WED],
        },
        [DayOfWeekEnum.THU]: {
          dayOfWeek: DayOfWeekEnum.THU,
          maxChildren: capacities[DayOfWeekEnum.THU],
        },
        [DayOfWeekEnum.FRI]: {
          dayOfWeek: DayOfWeekEnum.FRI,
          maxChildren: capacities[DayOfWeekEnum.FRI],
        },
      },
    };

    this.store.dispatch(createCapacitiesByPlanningId({ dto: planningCapacity }));
    this.store.dispatch(resetDraftCapacities());
    this.visible.set(false);
  }
}
