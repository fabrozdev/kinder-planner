import { Component, input, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { ChildrenImport } from './components/children-import/children-import';

@Component({
  selector: 'app-settings-dialog',
  imports: [
    Dialog,
    ButtonModule,
    Divider,
    ChildrenImport,
  ],
  templateUrl: './settings-dialog.html',
  standalone: true,
})
export class SettingsDialog {
  visible = input.required<boolean>();
  visibleChange = output<boolean>();

  close() {
    this.visibleChange.emit(false);
  }
}
