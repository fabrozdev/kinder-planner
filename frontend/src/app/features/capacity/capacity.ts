import { Component, input, signal } from '@angular/core';
import { CapacityDialog } from '@/app/components/capacity-dialog/capacity-dialog';
import { Location } from '@/app/shared/models/location';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-capacity',
  imports: [ButtonModule, CapacityDialog],
  templateUrl: './capacity.html',
})
export class Capacity {
  location = input.required<Location>();
  capacityDialogVisible = signal(false);

  openDialog() {
    this.capacityDialogVisible.set(true);
  }
}
