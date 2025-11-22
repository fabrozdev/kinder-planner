import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CapacityDialog } from '@/app/components/capacity-dialog/capacity-dialog';
import { Location } from '@/app/shared/models/location';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-capacity',
  imports: [ButtonModule],
  templateUrl: './capacity.html',
})
export class Capacity {
  readonly dialog = inject(MatDialog);
  location = input.required<Location>();

  openDialog() {
    this.dialog.open(CapacityDialog, {
      data: this.location(),
    });
  }
}
