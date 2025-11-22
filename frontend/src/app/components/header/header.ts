import { Component, signal } from '@angular/core';
import { SettingsDialog } from '@/app/components/settings-dialog/settings-dialog';
import { PlannerNavigator } from '@/app/features/planner/components/planner-navigator/planner-navigator';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [PlannerNavigator, ButtonModule, SelectButtonModule, FormsModule, SettingsDialog],
  templateUrl: './header.html',
})
export class Header {
  mode = signal<'MONTH' | 'YEAR'>('MONTH');
  settingsDialogVisible = signal(false);

  modeOptions = [
    { label: 'Monthly', value: 'MONTH' },
    { label: 'Yearly', value: 'YEAR' },
  ];

  openDialog() {
    this.settingsDialogVisible.set(true);
  }
}
