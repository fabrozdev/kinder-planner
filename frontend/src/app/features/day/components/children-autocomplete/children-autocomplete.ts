import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Child } from '@/app/shared/models/child';
import { CreateAssignment } from '@/app/shared/models/assignment';
import { Store } from '@ngrx/store';
import { selectAllChildren } from '@/app/store/children';
import { createAssignment } from '@/app/store/assignments';
import { selectPlanningByLocation } from '@/app/store/plannings';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-children-autocomplete',
  imports: [ReactiveFormsModule, AutoComplete],
  templateUrl: './children-autocomplete.html',
})
export class ChildrenAutocomplete implements OnInit {
  private readonly store = inject(Store);

  dayOfWeek = input.required<number>();
  locationId = input.required<string>();

  myControl = new FormControl<string | Child>('');
  filteredOptions: Observable<Child[]> | undefined;
  suggestions: (Child & { displayName: string })[] = [];

  options = this.store.selectSignal(selectAllChildren);

  constructor() {
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

  onSearch(event: { query: string }) {
    const query = event.query.toLowerCase();
    const filtered = query ? this._filter(query) : this.options().slice();
    this.suggestions = filtered.map(child => ({
      ...child,
      displayName: `${child.firstName} ${child.lastName}`
    }));
  }

  onOptionSelected(child: Child) {
    if (!child) {
      return;
    }

    const locationId = this.locationId();

    let planning: any = null;
    this.store
      .select(selectPlanningByLocation(locationId))
      .subscribe((p) => (planning = p))
      .unsubscribe();

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

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    this.store.dispatch(createAssignment({ dto: assignmentDto, tempId }));
    this.myControl.reset();
  }

  private _filter(name: string): Child[] {
    const filterValue = name.toLowerCase();
    return this.options().filter((option) => option.firstName.toLowerCase().includes(filterValue));
  }
}
