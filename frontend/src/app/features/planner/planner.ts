import { Component, signal, inject } from '@angular/core';
import { Schedule } from '../schedule/schedule';
import { PlannerSkeleton } from './components/planner-skeleton/planner-skeleton';
import { PlannerNavigator } from './components/planner-navigator/planner-navigator';
import { Header } from '../../components/header/header';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-planner',
  imports: [Schedule, PlannerSkeleton, PlannerNavigator, Header],
  templateUrl: './planner.html',
})
export class Planner {
  private readonly http = inject(HttpClient);
  loading = signal(false);

  constructor() {
    this.loading.set(true);
    this.loadPlanning();
  }

  private loadPlanning() {
    this.http.get('http://localhost:8080/api/planning').subscribe({
      next: (data) => {
        console.log('Planning data:', data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading planning:', error);
        this.loading.set(false);
      },
    });
  }
}
