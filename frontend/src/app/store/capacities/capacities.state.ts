import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Capacity } from '../../shared/models/capacity';
import { DayOfWeekEnum } from '../../shared/models/day-of-week';

export interface CapacitiesState extends EntityState<Capacity> {
  loading: boolean;
  loadingByPlanningLocation: { [key: string]: boolean };
  loadedPlanningLocationKeys: Set<string>;
  error: string | null;
  draftCapacities: Record<DayOfWeekEnum, number>;
}

export const capacitiesAdapter: EntityAdapter<Capacity> =
  createEntityAdapter<Capacity>({
    selectId: (capacity: Capacity) => capacity.id,
  });

export const initialCapacitiesState: CapacitiesState =
  capacitiesAdapter.getInitialState({
    loading: false,
    loadingByPlanningLocation: {},
    loadedPlanningLocationKeys: new Set<string>(),
    error: null,
    draftCapacities: {
      [DayOfWeekEnum.MON]: 0,
      [DayOfWeekEnum.TUE]: 0,
      [DayOfWeekEnum.WED]: 0,
      [DayOfWeekEnum.THU]: 0,
      [DayOfWeekEnum.FRI]: 0,
    },
  });