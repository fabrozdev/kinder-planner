import { Component } from '@angular/core';
import { Schedule } from '../schedule/schedule';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-planner',
  imports: [Schedule, MatIcon, MatIconButton, MatIcon],
  templateUrl: './planner.html',
})
export class Planner {}
