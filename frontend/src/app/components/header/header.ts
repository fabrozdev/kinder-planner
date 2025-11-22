import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialog } from '@/app/components/settings-dialog/settings-dialog';
import { PlannerNavigator } from '@/app/features/planner/components/planner-navigator/planner-navigator';
import { ButtonModule } from 'primeng/button';
import { SelectButton, SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [PlannerNavigator, ButtonModule, SelectButtonModule, FormsModule],
  templateUrl: './header.html',
})
export class Header {
  readonly dialog = inject(MatDialog);
  mode = signal<'MONTH' | 'YEAR'>('MONTH');

  modeOptions = [
    { label: 'Monthly', value: 'MONTH' },
    { label: 'Yearly', value: 'YEAR' },
  ];

  openDialog() {
    const dialogRef = this.dialog.open(SettingsDialog);
  }
}
