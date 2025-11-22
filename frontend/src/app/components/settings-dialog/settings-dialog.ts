import { Component, effect, input, model, signal } from '@angular/core';
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
  visible = model.required<boolean>();

  close() {
    this.visible.set(false);
  }
}
