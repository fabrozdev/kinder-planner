import { Assignment } from '@/app/shared/models/assignment';

interface Planning {
  id: string;
  year: number;
  month: number;
  label: string;
  locationId: string;
}

interface PlanningWithAssignment extends Planning {
  assignments: Assignment[];
}

export type { Planning, PlanningWithAssignment };
