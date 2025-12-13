import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-planner-navigator',
  imports: [ButtonModule],
  templateUrl: './planner-navigator.html',
})
export class PlannerNavigator {
  currentMonth = new Date().toLocaleString('default', { month: 'long' });
}
