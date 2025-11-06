import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { SettingsDialog } from '../settings-dialog/settings-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatIconButton],
  templateUrl: './header.html',
})
export class Header {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(SettingsDialog);
  }
}
