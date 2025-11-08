import { Component, inject, input } from '@angular/core';
import { Capability } from '@/app/features/day/components/capability/capability';
import { ReactiveFormsModule } from '@angular/forms';
import { ChildrenAutocomplete } from '@/app/features/day/components/children-autocomplete/children-autocomplete';
import { MatChip, MatChipRemove } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { PlanningStateService } from '@/app/services/planning-state.service';
import { DayOfWeek } from '@/app/shared/models/day-of-week';

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
  private readonly stateService = inject(PlanningStateService);

  // Input signals
  day = input.required<DayOfWeek>();
  locationId = input.required<string>();

  get dayOfWeek(): number {
    return DAY_OF_WEEK_MAP[this.day().key] || 0;
  }

  onRemoveChild(assignmentId: string) {
    this.stateService.deleteAssignment(assignmentId);
  }
}
