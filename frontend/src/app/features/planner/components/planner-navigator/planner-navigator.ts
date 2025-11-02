import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-planner-navigator',
  imports: [MatIcon, MatIconButton],
  templateUrl: './planner-navigator.html',
})
export class PlannerNavigator {}
