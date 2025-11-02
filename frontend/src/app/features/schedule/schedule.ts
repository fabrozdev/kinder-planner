import { Component, Input } from '@angular/core';
import { Day } from '../day/day';

const CHILDREN: { id: string; name: string }[] = [
  {
    id: '0',
    name: 'Fabrizzio',
  },
  {
    id: '1',
    name: 'Amber',
  },
  {
    id: '2',
    name: 'Cris',
  },
  {
    id: '3',
    name: 'Jelle',
  },
].sort((a, b) => a.name.localeCompare(b.name));

@Component({
  selector: 'app-schedule',
  imports: [Day],
  templateUrl: './schedule.html',
})
export class Schedule {
  @Input()
  location!: { name: string };
  daysOfWeek: DayOfWeek[] = [
    { key: 'MON', label: 'Monday', short: 'Mon', capability: { max: 10 }, children: [] },
    {
      key: 'TUE',
      label: 'Tuesday',
      short: 'Tue',
      capability: { max: 10 },
      children: [...CHILDREN, ...CHILDREN, ...CHILDREN],
    },
    { key: 'WED', label: 'Wednesday', short: 'Wed', capability: { max: 10 }, children: [] },
    { key: 'THU', label: 'Thursday', short: 'Thu', capability: { max: 10 }, children: CHILDREN },
    { key: 'FRI', label: 'Friday', short: 'Fri', capability: { max: 10 }, children: CHILDREN },
  ];
}
