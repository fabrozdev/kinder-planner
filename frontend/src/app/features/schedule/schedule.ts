import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Day } from '../day/day';
import { Location } from '../../shared/models/location';
import { Assignment } from '../../shared/models/assignment';
import { AssignmentService } from '../../services/assignment.service';
import { Planning } from '../../shared/models/planning';
import { ChildrenService } from '../../services/children.service';
import { Child } from '../../shared/models/child';
import { concatMap, tap } from 'rxjs';

@Component({
  selector: 'app-schedule',
  imports: [Day],
  templateUrl: './schedule.html',
})
export class Schedule implements OnInit {
  private readonly assignmentService = inject(AssignmentService);
  private readonly childrenService = inject(ChildrenService);

  @Input()
  location!: Location;

  @Input()
  planning!: Planning;

  loading = signal(false);
  assignments = signal<Assignment[] | null>(null);
  children: Child[] = [];

  daysOfWeek: DayOfWeek[] = this.initializeDaysOfWeek();

  ngOnInit() {
    if (this.location && this.planning) {
      this.loading.set(true);
      this.initialize();
    }
  }

  private initialize() {
    this.childrenService
      .getChildren()
      .pipe(
        tap((children) => {
          this.children = children;
        }),
        concatMap(() =>
          this.assignmentService.getAssignmentsByLocationIdAndPlanningId(
            this.planning.id,
            this.location.id,
          ),
        ),
      )
      .subscribe({
        next: (assignments) => {
          console.log('Assignments data:', assignments);
          this.daysOfWeek = this.mapAssignmentsToDays(assignments);
          console.log('Days of week:', this.daysOfWeek);

          this.assignments.set(assignments);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.loading.set(false);
        },
      });
  }

  private initializeDaysOfWeek(): DayOfWeek[] {
    return [
      { key: 'MON', label: 'Monday', short: 'Mon', capability: { max: 10 }, children: [] },
      { key: 'TUE', label: 'Tuesday', short: 'Tue', capability: { max: 10 }, children: [] },
      { key: 'WED', label: 'Wednesday', short: 'Wed', capability: { max: 10 }, children: [] },
      { key: 'THU', label: 'Thursday', short: 'Thu', capability: { max: 10 }, children: [] },
      { key: 'FRI', label: 'Friday', short: 'Fri', capability: { max: 10 }, children: [] },
    ];
  }

  private mapAssignmentsToDays(assignments: Assignment[]): DayOfWeek[] {
    const days = this.initializeDaysOfWeek();

    // Map assignments to days
    for (const assignment of assignments) {
      const child = this.children.find((c) => c.id === assignment.childId);
      if (!child) continue;

      const day = days.find((d) => this.getDayNumber(d.key) === assignment.dayOfWeek);
      if (!day) continue;

      day.children.push({
        id: child.id,
        name: `${child.firstName} ${child.lastName}`,
        group: child.group,
        assignmentId: assignment.id,
      });
    }

    // Sort children by firstName in ascending order for each day
    for (const day of days) {
      day.children.sort((a, b) => a.name.localeCompare(b.name));
    }

    return days;
  }

  private getDayNumber(dayKey: string): number {
    const dayMap: Record<string, number> = {
      MON: 0,
      TUE: 1,
      WED: 2,
      THU: 3,
      FRI: 4,
    };
    return dayMap[dayKey] || 0;
  }

  onAssignmentCreated(assignment: Assignment) {
    // Find the child for the new assignment
    const child = this.children.find((c) => c.id === assignment.childId);
    if (!child) return;

    // Find the day to add the child to
    const day = this.daysOfWeek.find((d) => this.getDayNumber(d.key) === assignment.dayOfWeek);
    if (!day) return;

    // Add the child to the day's children array
    day.children.push({
      id: child.id,
      name: `${child.firstName} ${child.lastName}`,
      assignmentId: assignment.id,
      group: child.group,
    });

    // Re-sort children by name
    day.children.sort((a, b) => a.name.localeCompare(b.name));
  }

  onAssignmentDeleted(assignmentId: string) {
    // Find the day containing the assignment
    for (const day of this.daysOfWeek) {
      const childIndex = day.children.findIndex((c) => c.assignmentId === assignmentId);
      if (childIndex !== -1) {
        // Remove the child from the day
        day.children.splice(childIndex, 1);
        break;
      }
    }
  }
}
