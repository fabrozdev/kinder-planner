import { DayOfWeekEnum } from '@/app/shared/models/day-of-week';

interface CreatePlanningCapacity {
  planningId: string;
  locationId: string;
  capacities: Record<DayOfWeekEnum, DayCapacity>;
}

interface DayCapacity {
  dayOfWeek: string;
  maxChildren: number;
}

interface Capacity {
  id: string;
  planningId: string;
  locationId: string;
  dayOfWeek: DayOfWeekEnum;
  maxChildren: number;
  createdAt: Date;
  updatedAt: Date;
}

export type { CreatePlanningCapacity, Capacity, DayCapacity };
