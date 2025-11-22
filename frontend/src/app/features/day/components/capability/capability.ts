import { Component, input } from '@angular/core';
import { Chip } from 'primeng/chip';
import { DayOfWeek } from '@/app/shared/models/day-of-week';

@Component({
  selector: 'app-capability',
  imports: [Chip],
  templateUrl: './capability.html',
})
export class Capability {
  capability = input<DayOfWeek['capability']>({
    max: 0,
  });

  count = input<number>(0);
}
