import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Capability } from './components/capability/capability';
import { ReactiveFormsModule } from '@angular/forms';
import { ChildrenAutocomplete } from './components/children-autocomplete/children-autocomplete';
import { MatChip, MatChipRemove } from '@angular/material/chips';
import { Assignment } from '../../shared/models/assignment';
import { MatIcon } from '@angular/material/icon';

const DAY_OF_WEEK_MAP: Record<string, number> = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
};

@Component({
  selector: 'app-day',
  imports: [Capability, ReactiveFormsModule, ChildrenAutocomplete, MatChip, MatChipRemove, MatIcon],
  templateUrl: './day.html',
})
export class Day {
  @Input() day!: DayOfWeek;
  @Input() children: { id: string; name: string }[] = [];
  @Input() locationId!: string;
  @Input() planningId!: string;

  @Output() assignmentCreated = new EventEmitter<Assignment>();

  get dayOfWeek(): number {
    return DAY_OF_WEEK_MAP[this.day.key] || 0;
  }

  onAssignmentCreated(assignment: Assignment) {
    this.assignmentCreated.emit(assignment);
  }
}
