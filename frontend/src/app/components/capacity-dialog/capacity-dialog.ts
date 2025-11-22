import { Component, input, model } from '@angular/core';
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
  visible = model.required<boolean>();

  close() {
    this.visible.set(false);
  }

  save() {
    // Add save logic here if needed
    this.visible.set(false);
  }
}
