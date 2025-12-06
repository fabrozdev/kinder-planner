import { Assignment } from '@/app/shared/models/assignment';

interface DayOfWeek {
  key: DayOfWeekEnum;
  label: string;
  short: string;
  capacity?: {
    max: number;
  };
  assignments: Assignment[];
}

enum DayOfWeekEnum {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
}

const WEEKDAY: ReadonlyArray<DayOfWeek> = [
  { key: DayOfWeekEnum.MON, label: 'Monday', short: 'Mon', capacity: { max: 10 }, assignments: [] },
  {
    key: DayOfWeekEnum.TUE,
    label: 'Tuesday',
    short: 'Tue',
    capacity: { max: 10 },
    assignments: [],
  },
  {
    key: DayOfWeekEnum.WED,
    label: 'Wednesday',
    short: 'Wed',
    capacity: { max: 10 },
    assignments: [],
  },
  {
    key: DayOfWeekEnum.THU,
    label: 'Thursday',
    short: 'Thu',
    capacity: { max: 10 },
    assignments: [],
  },
  { key: DayOfWeekEnum.FRI, label: 'Friday', short: 'Fri', capacity: { max: 10 }, assignments: [] },
];

export { type DayOfWeek, DayOfWeekEnum, WEEKDAY };
