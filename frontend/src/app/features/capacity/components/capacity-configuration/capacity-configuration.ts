import { Component, signal } from '@angular/core';
import { Divider } from 'primeng/divider';
import { DayOfWeek } from '@/app/shared/models/day-of-week';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-capacity-configuration',
  imports: [Divider, ButtonModule],
  templateUrl: './capacity-configuration.html',
})
export class CapacityConfiguration {
  daysOfWeek = signal<Omit<DayOfWeek, 'assignments'>[]>([
    { key: 'MON', label: 'Monday', short: 'Mon', capacity: { max: 0 } },
    { key: 'TUE', label: 'Tuesday', short: 'Tue', capacity: { max: 0 } },
    { key: 'WED', label: 'Wednesday', short: 'Wed', capacity: { max: 0 } },
    { key: 'THU', label: 'Thursday', short: 'Thu', capacity: { max: 0 } },
    { key: 'FRI', label: 'Friday', short: 'Fri', capacity: { max: 0 } },
  ]);

  add(dayKey: DayOfWeek['key']) {
    this.daysOfWeek.set(
      this.daysOfWeek().map((day) =>
        day.key === dayKey ? { ...day, capacity: { max: (day.capacity?.max ?? 0) + 1 } } : day,
      ),
    );
  }

  remove(dayKey: DayOfWeek['key']) {
    this.daysOfWeek.set(
      this.daysOfWeek().map((day) =>
        day.key === dayKey
          ? { ...day, capacity: { max: Math.max(0, (day.capacity?.max ?? 0) - 1) } }
          : day,
      ),
    );
  }
}
