import { Component, input, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CapacityConfiguration } from '@/app/features/capacity/components/capacity-configuration/capacity-configuration';
import { Location } from '@/app/shared/models/location';

@Component({
  selector: 'app-capacity-dialog',
  imports: [
    Dialog,
    ButtonModule,
    CapacityConfiguration,
  ],
  templateUrl: './capacity-dialog.html',
  standalone: true,
})
export class CapacityDialog {
  location = input.required<Location>();
  visible = input.required<boolean>();
  visibleChange = output<boolean>();

  close() {
    this.visibleChange.emit(false);
  }

  save() {
    // Add save logic here if needed
    this.visibleChange.emit(false);
  }
}
