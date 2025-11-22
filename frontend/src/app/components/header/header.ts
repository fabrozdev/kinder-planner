import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialog } from '@/app/components/settings-dialog/settings-dialog';
import { PlannerNavigator } from '@/app/features/planner/components/planner-navigator/planner-navigator';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [PlannerNavigator, MatChipListbox, MatChipOption, ButtonModule],
  templateUrl: './header.html',
})
export class Header {
  readonly dialog = inject(MatDialog);
  mode = signal<'MONTH' | 'YEAR'>('MONTH');

  openDialog() {
    const dialogRef = this.dialog.open(SettingsDialog);
  }
}
