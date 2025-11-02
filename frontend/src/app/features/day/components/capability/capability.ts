import { Component, Input } from '@angular/core';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-capability',
  imports: [MatChip],
  templateUrl: './capability.html',
})
export class Capability {
  @Input()
  capability: DayOfWeek['capability'] = {
    max: 0,
  };
}
