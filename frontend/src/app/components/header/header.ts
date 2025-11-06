import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialog } from '@/app/components/settings-dialog/settings-dialog';
import { PlannerNavigator } from '@/app/features/planner/components/planner-navigator/planner-navigator';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatIconButton, PlannerNavigator, MatChipListbox, MatChipOption],
  templateUrl: './header.html',
})
export class Header {
  readonly dialog = inject(MatDialog);
  mode = signal<'MONTH' | 'YEAR'>('MONTH');

  openDialog() {
    const dialogRef = this.dialog.open(SettingsDialog);
  }
}
