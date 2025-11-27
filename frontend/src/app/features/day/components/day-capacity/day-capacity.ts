import { Component, input } from '@angular/core';
import { Chip } from 'primeng/chip';
import { DayOfWeek } from '@/app/shared/models/day-of-week';

@Component({
  selector: 'app-day-capacity',
  imports: [Chip],
  templateUrl: './day-capacity.html',
})
export class DayCapacity {
  capacity = input<DayOfWeek['capacity']>({
    max: 0,
  });

  count = input<number>(0);
}
