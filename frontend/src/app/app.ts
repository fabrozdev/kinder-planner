import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Planner } from './features/planner/planner';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Planner, ToastModule],
  templateUrl: './app.html',
})
export class App {}
