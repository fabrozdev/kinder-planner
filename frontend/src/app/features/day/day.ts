import { Component, inject, input } from '@angular/core';
import { DayCapacity } from '@/app/features/day/components/day-capacity/day-capacity';
import { ReactiveFormsModule } from '@angular/forms';
import { ChildrenAutocomplete } from '@/app/features/day/components/children-autocomplete/children-autocomplete';
import { ChipModule } from 'primeng/chip';
import { DayOfWeek } from '@/app/shared/models/day-of-week';
import { Store } from '@ngrx/store';
import { deleteAssignment } from '@/app/store/assignments';

const DAY_OF_WEEK_MAP: Record<string, number> = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
};

@Component({
  selector: 'app-day',
  imports: [DayCapacity, ReactiveFormsModule, ChildrenAutocomplete, ChipModule],
  templateUrl: './day.html',
})
export class Day {
  private readonly store = inject(Store);

  day = input.required<DayOfWeek>();
  locationId = input.required<string>();

  get dayOfWeek(): number {
    return DAY_OF_WEEK_MAP[this.day().key] || 0;
  }

  onRemoveChild(assignmentId: string) {
    this.store.dispatch(deleteAssignment({ assignmentId }));
  }
}
