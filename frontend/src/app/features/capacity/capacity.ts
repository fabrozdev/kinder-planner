import { Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CapacityDialog } from '@/app/components/capacity-dialog/capacity-dialog';
import { Location } from '@/app/shared/models/location';

@Component({
  selector: 'app-capacity',
  imports: [MatIcon, MatIconButton],
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
