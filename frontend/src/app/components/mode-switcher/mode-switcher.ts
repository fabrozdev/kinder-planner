import { Component, signal } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mode-switcher',
  imports: [SelectButtonModule, FormsModule],
  templateUrl: './mode-switcher.html',
  standalone: true,
})
export class ModeSwitcher {
  mode = signal<'MONTH' | 'YEAR'>('MONTH');

  modeOptions = [
    { label: 'Monthly', value: 'MONTH' },
    { label: 'Yearly', value: 'YEAR' },
  ];
}