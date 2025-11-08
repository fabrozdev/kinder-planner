import { Component, input } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { DayOfWeek } from '@/app/shared/models/day-of-week';

@Component({
  selector: 'app-capability',
  imports: [MatChip],
  templateUrl: './capability.html',
})
export class Capability {
  capability = input<DayOfWeek['capability']>({
    max: 0,
  });

  count = input<number>(0);
}
