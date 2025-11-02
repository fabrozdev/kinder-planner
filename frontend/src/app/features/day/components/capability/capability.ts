import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-capability',
  imports: [],
  templateUrl: './capability.html',
})
export class Capability {
  @Input()
  capability: DayOfWeek['capability'] = {
    max: 0,
  };
}
