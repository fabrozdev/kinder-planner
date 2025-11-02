import { Component, Input } from '@angular/core';
import { Capability } from './components/capability/capability';
import { ReactiveFormsModule } from '@angular/forms';
import { ChildrenAutocomplete } from './components/children-autocomplete/children-autocomplete';
import { MatChip } from '@angular/material/chips';

export interface User {
  name: string;
}

@Component({
  selector: 'app-day',
  imports: [Capability, ReactiveFormsModule, ChildrenAutocomplete, MatChip],
  templateUrl: './day.html',
})
export class Day {
  @Input() day!: DayOfWeek;
  @Input() children: { id: string; name: string }[] = [];
}
