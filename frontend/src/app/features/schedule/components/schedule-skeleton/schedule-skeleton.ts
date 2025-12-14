import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-schedule-skeleton',
  imports: [Card, Skeleton],
  templateUrl: './schedule-skeleton.html',
})
export class ScheduleSkeleton {}
