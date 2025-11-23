import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SettingsDialog } from '@/app/components/settings-dialog/settings-dialog';
import { LocationDialog } from '@/app/components/location-dialog/location-dialog';

@Component({
  selector: 'app-location-button',
  imports: [ButtonModule, SettingsDialog, LocationDialog],
  templateUrl: './location-button.html',
  standalone: true,
})
export class LocationButton {
  locationDialogVisible = signal(false);

  openDialog() {
    this.locationDialogVisible.set(true);
  }
}
