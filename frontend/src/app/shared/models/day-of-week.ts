import { Assignment } from '@/app/shared/models/assignment';

interface DayOfWeek {
  key: string;
  label: string;
  short: string;
  capability?: {
    max: number;
  };
  assignments: Assignment[];
}

const WEEKDAY: ReadonlyArray<DayOfWeek> = [
  { key: 'MON', label: 'Monday', short: 'Mon', capability: { max: 10 }, assignments: [] },
  { key: 'TUE', label: 'Tuesday', short: 'Tue', capability: { max: 10 }, assignments: [] },
  { key: 'WED', label: 'Wednesday', short: 'Wed', capability: { max: 10 }, assignments: [] },
  { key: 'THU', label: 'Thursday', short: 'Thu', capability: { max: 10 }, assignments: [] },
  { key: 'FRI', label: 'Friday', short: 'Fri', capability: { max: 10 }, assignments: [] },
];

export { type DayOfWeek, WEEKDAY };
