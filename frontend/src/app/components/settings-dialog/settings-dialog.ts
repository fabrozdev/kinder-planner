import { Component, signal } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-settings-dialog',
  imports: [
    MatDialogActions,
    MatButton,
    MatIcon,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIconButton,
    MatDivider,
  ],
  templateUrl: './settings-dialog.html',
  standalone: true,
})
export class SettingsDialog {
  fileName = signal<string | null>(null);
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fileName.set(file.name);
      console.log('File uploaded:', file.name);
    };
    reader.readAsText(file);
  }
}
