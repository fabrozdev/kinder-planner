import { Component, Input } from '@angular/core';
import { Capability } from './components/capability/capability';

@Component({
  selector: 'app-day',
  imports: [Capability],
  templateUrl: './day.html',
})
export class Day {
  @Input() day!: DayOfWeek;
}
