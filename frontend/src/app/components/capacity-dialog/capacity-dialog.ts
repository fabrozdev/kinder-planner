import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { CapacityConfiguration } from '@/app/features/capacity/components/capacity-configuration/capacity-configuration';
import { Location } from '@/app/shared/models/location';

@Component({
  selector: 'app-capacity-dialog',
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    CapacityConfiguration,
  ],
  templateUrl: './capacity-dialog.html',
  standalone: true,
})
export class CapacityDialog {
  readonly location = inject<Location>(MAT_DIALOG_DATA);
}
