import { Component, signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-capacity-configuration',
  imports: [MatDivider, MatIcon, MatIconButton],
  templateUrl: './capacity-configuration.html',
})
export class CapacityConfiguration {
  daysOfWeek = signal<Omit<DayOfWeek, 'children'>[]>([
    { key: 'MON', label: 'Monday', short: 'Mon', capability: { max: 0 } },
    { key: 'TUE', label: 'Tuesday', short: 'Tue', capability: { max: 0 } },
    { key: 'WED', label: 'Wednesday', short: 'Wed', capability: { max: 0 } },
    { key: 'THU', label: 'Thursday', short: 'Thu', capability: { max: 0 } },
    { key: 'FRI', label: 'Friday', short: 'Fri', capability: { max: 0 } },
  ]);

  add(dayKey: DayOfWeek['key']) {
    this.daysOfWeek.set(
      this.daysOfWeek().map((day) =>
        day.key === dayKey ? { ...day, capability: { max: (day.capability?.max ?? 0) + 1 } } : day,
      ),
    );
  }

  remove(dayKey: DayOfWeek['key']) {
    this.daysOfWeek.set(
      this.daysOfWeek().map((day) =>
        day.key === dayKey
          ? { ...day, capability: { max: Math.max(0, (day.capability?.max ?? 0) - 1) } }
          : day,
      ),
    );
  }
}
