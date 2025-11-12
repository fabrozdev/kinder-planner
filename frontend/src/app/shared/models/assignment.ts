import { Child } from '@/app/shared/models/child';

interface Assignment {
  id: string;
  locationId: string;
  dayOfWeek: number;
  childId: string;
  planningId: string;
  child: Child;
  note: string;
}

interface CreateAssignment {
  locationId: string;
  dayOfWeek: number;
  childId: string;
  planningId: string;
  note: string;
}

export type { Assignment, CreateAssignment };
