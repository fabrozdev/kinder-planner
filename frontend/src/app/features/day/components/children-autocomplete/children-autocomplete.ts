import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { Child } from '../../../../shared/models/child';
import { ChildrenService } from '../../../../services/children.service';
import { AssignmentService } from '../../../../services/assignment.service';
import { CreateAssignmentDto } from '../../../../shared/models/dto/create-assignment-dto';
import { Assignment } from '../../../../shared/models/assignment';

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
  private readonly childrenService = inject(ChildrenService);
  private readonly assignmentService = inject(AssignmentService);

  @Input() locationId!: string;
  @Input() planningId!: string;
  @Input() dayOfWeek!: number;

  @Output() assignmentCreated = new EventEmitter<Assignment>();

  myControl = new FormControl<string | Child>('');
  options: Child[] = [];
  filteredOptions: Observable<Child[]> | undefined;

  ngOnInit() {
    this.loadChildren();
  }

  private loadChildren() {
    this.childrenService.getChildren().subscribe({
      next: (children) => {
        this.options = children;
        this.setupFilteredOptions();
      },
      error: (error) => {
        console.error('Error loading children:', error);
        this.setupFilteredOptions();
      },
    });
  }

  private setupFilteredOptions() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : (value?.firstName ?? '');
        return name ? this._filter(name) : this.options.slice();
      }),
    );
  }

  displayFn(child: Child): string {
    return child?.firstName ?? '';
  }

  onOptionSelected(child: Child) {
    if (!child) {
      return;
    }

    console.log(this.dayOfWeek);
    const assignmentDto: CreateAssignmentDto = {
      locationId: this.locationId,
      dayOfWeek: this.dayOfWeek,
      childId: child.id,
      planningId: this.planningId,
      note: '',
    };

    this.assignmentService.createAssignment(assignmentDto).subscribe({
      next: (assignment) => {
        console.log('Assignment created:', assignment);
        this.assignmentCreated.emit(assignment);
        this.myControl.reset();
      },
      error: (error) => {
        console.error('Error creating assignment:', error);
      },
    });
  }

  private _filter(name: string): Child[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) => option.firstName.toLowerCase().includes(filterValue));
  }
}
