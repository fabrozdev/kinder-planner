import { Component } from '@angular/core';
import { Day } from '../day/day';

@Component({
  selector: 'app-schedule',
  imports: [Day],
  templateUrl: './schedule.html',
})
export class Schedule {
  daysOfWeek: DayOfWeek[] = [
    { key: 'MON', label: 'Monday', short: 'Mon', capability: { max: 10 } },
    { key: 'TUE', label: 'Tuesday', short: 'Tue', capability: { max: 10 } },
    { key: 'WED', label: 'Wednesday', short: 'Wed', capability: { max: 10 } },
    { key: 'THU', label: 'Thursday', short: 'Thu', capability: { max: 10 } },
    { key: 'FRI', label: 'Friday', short: 'Fri', capability: { max: 10 } },
  ];
}
