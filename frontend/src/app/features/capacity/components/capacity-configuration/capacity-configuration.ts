import { Component, signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { DayOfWeek } from '@/app/shared/models/day-of-week';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-capacity-configuration',
  imports: [MatDivider, ButtonModule],
  templateUrl: './capacity-configuration.html',
})
export class CapacityConfiguration {
  daysOfWeek = signal<Omit<DayOfWeek, 'assignments'>[]>([
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
