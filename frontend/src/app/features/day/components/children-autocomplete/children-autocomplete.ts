import { Component, OnInit } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { User } from '../../day';
import { map, Observable, startWith } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

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
  myControl = new FormControl<string | User>('');
  options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
  filteredOptions: Observable<User[]> | undefined;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name) : this.options.slice();
      }),
    );
  }

  displayFn(user: User): string {
    return user?.name ?? '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) => option.name.toLowerCase().includes(filterValue));
  }
}
