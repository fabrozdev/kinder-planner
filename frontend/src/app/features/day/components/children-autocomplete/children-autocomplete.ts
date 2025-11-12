import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { Child } from '@/app/shared/models/child';
import { PlanningStateService } from '@/app/services/planning-state.service';
import { CreateAssignment } from '@/app/shared/models/assignment';

@Component({
  selector: 'app-children-autocomplete',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
    MatIcon,
  ],
  templateUrl: './children-autocomplete.html',
})
export class ChildrenAutocomplete implements OnInit {
  private readonly stateService = inject(PlanningStateService);

  // Input signals
  dayOfWeek = input.required<number>();
  locationId = input.required<string>();

  myControl = new FormControl<string | Child>('');
  filteredOptions: Observable<Child[]> | undefined;

  // Computed signal for children from state
  options = computed(() => this.stateService.children());

  constructor() {
    // Effect to update filtered options when children change
    effect(() => {
      const children = this.options();
      if (children.length > 0) {
        this.setupFilteredOptions();
      }
    });
  }

  ngOnInit() {
    this.setupFilteredOptions();
  }

  private setupFilteredOptions() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : (value?.firstName ?? '');
        return name ? this._filter(name) : this.options().slice();
      }),
    );
  }

  displayFn(child: Child): string {
    return child ? `${child?.firstName} ${child?.lastName}` : '';
  }

  onOptionSelected(child: Child) {
    if (!child) {
      return;
    }

    const locationId = this.locationId();
    const plannings = this.stateService.plannings();

    // Find the planning for this location
    const planning = plannings.find((p) => p.locationId.includes(locationId));

    if (!planning) {
      console.error('Planning not available for location:', locationId);
      return;
    }

    const assignmentDto: CreateAssignment = {
      locationId: locationId,
      dayOfWeek: this.dayOfWeek(),
      childId: child.id,
      planningId: planning.id,
      note: '',
    };

    this.stateService.createAssignment(assignmentDto);
    this.myControl.reset();
  }

  private _filter(name: string): Child[] {
    const filterValue = name.toLowerCase();
    return this.options().filter((option) => option.firstName.toLowerCase().includes(filterValue));
  }
}
