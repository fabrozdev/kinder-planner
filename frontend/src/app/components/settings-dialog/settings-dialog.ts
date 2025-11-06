import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { ChildrenImport } from './components/children-import/children-import';

@Component({
  selector: 'app-settings-dialog',
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDivider,
    ChildrenImport,
  ],
  templateUrl: './settings-dialog.html',
  standalone: true,
})
export class SettingsDialog {}
