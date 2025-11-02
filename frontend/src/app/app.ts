import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Planner } from './features/planner/planner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Planner],
  templateUrl: './app.html',
})
export class App {}
