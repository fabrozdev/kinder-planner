import { Component, signal } from '@angular/core';
import { Schedule } from '../schedule/schedule';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PlannerSkeleton } from './components/planner-skeleton/planner-skeleton';
import { PlannerNavigator } from './components/planner-navigator/planner-navigator';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-planner',
  imports: [Schedule, MatIcon, MatIconButton, MatIcon, PlannerSkeleton, PlannerNavigator, Header],
  templateUrl: './planner.html',
  styles: [
    `
      .schedule-container {
        animation: fadeInUp 0.3s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .schedule-container app-schedule:nth-child(2) {
        animation-delay: 0.2s;
        animation-fill-mode: both;
      }
    `,
  ],
})
export class Planner {
  loading = signal(false);

  constructor() {
    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
    }, 3000);
  }
}
