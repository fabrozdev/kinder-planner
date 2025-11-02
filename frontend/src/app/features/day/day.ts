import { Component, Input } from '@angular/core';
import { Capability } from './components/capability/capability';
import { ReactiveFormsModule } from '@angular/forms';
import { ChildrenAutocomplete } from './components/children-autocomplete/children-autocomplete';

export interface User {
  name: string;
}

@Component({
  selector: 'app-day',
  imports: [Capability, ReactiveFormsModule, ChildrenAutocomplete],
  templateUrl: './day.html',
})
export class Day {
  @Input() day!: DayOfWeek;
}
