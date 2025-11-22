import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SettingsDialog } from '@/app/components/settings-dialog/settings-dialog';

@Component({
  selector: 'app-settings-button',
  imports: [ButtonModule, SettingsDialog],
  templateUrl: './settings-button.html',
  standalone: true,
})
export class SettingsButton {
  settingsDialogVisible = signal(false);

  openDialog() {
    this.settingsDialogVisible.set(true);
  }
}