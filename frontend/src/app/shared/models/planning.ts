import { Assignment } from '@/app/shared/models/assignment';
import { DayOfWeekEnum } from '@/app/shared/models/day-of-week';
import { DayCapacity } from '@/app/shared/models/capacity';

interface Planning {
  id: string;
  year: number;
  month: number;
  label: string;
  locationId: string;
  weekCapacity: Record<DayOfWeekEnum, DayCapacity>;
}

interface PlanningWithAssignment extends Planning {
  assignments: Assignment[];
}

export type { Planning, PlanningWithAssignment };
