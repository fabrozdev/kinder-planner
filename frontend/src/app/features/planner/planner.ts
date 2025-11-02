import { Component } from '@angular/core';
import { Schedule } from '../schedule/schedule';

@Component({
  selector: 'app-planner',
  imports: [Schedule],
  templateUrl: './planner.html',
})
export class Planner {}
