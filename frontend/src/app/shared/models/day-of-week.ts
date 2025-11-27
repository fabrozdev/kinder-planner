import { Assignment } from '@/app/shared/models/assignment';

interface DayOfWeek {
  key: string;
  label: string;
  short: string;
  capacity?: {
    max: number;
  };
  assignments: Assignment[];
}

const WEEKDAY: ReadonlyArray<DayOfWeek> = [
  { key: 'MON', label: 'Monday', short: 'Mon', capacity: { max: 10 }, assignments: [] },
  { key: 'TUE', label: 'Tuesday', short: 'Tue', capacity: { max: 10 }, assignments: [] },
  { key: 'WED', label: 'Wednesday', short: 'Wed', capacity: { max: 10 }, assignments: [] },
  { key: 'THU', label: 'Thursday', short: 'Thu', capacity: { max: 10 }, assignments: [] },
  { key: 'FRI', label: 'Friday', short: 'Fri', capacity: { max: 10 }, assignments: [] },
];

export { type DayOfWeek, WEEKDAY };
