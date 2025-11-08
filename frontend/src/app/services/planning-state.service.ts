import { computed, inject, Injectable, signal } from '@angular/core';
import { Planning } from '@/app/shared/models/planning';
import { Location } from '@/app/shared/models/location';
import { Child } from '@/app/shared/models/child';
import { Assignment, CreateAssignment } from '@/app/shared/models/assignment';
import { DayOfWeek } from '@/app/shared/models/day-of-week';
import { PlannerService } from './planner.service';
import { LocationService } from './location.service';
import { ChildrenService } from './children.service';
import { AssignmentService } from './assignment.service';

@Injectable({
  providedIn: 'root',
})
export class PlanningStateService {
  private readonly plannerService = inject(PlannerService);
  private readonly locationService = inject(LocationService);
  private readonly childrenService = inject(ChildrenService);
  private readonly assignmentService = inject(AssignmentService);

  // Core state signals
  private readonly _planning = signal<Planning | null>(null);
  private readonly _locations = signal<Location[]>([]);
  private readonly _children = signal<Child[]>([]);
  private readonly _assignments = signal<Assignment[]>([]);
  private readonly _loading = signal<boolean>(false);

  // Exposed read-only signals
  readonly planning = this._planning.asReadonly();
  readonly locations = this._locations.asReadonly();
  readonly children = this._children.asReadonly();
  readonly assignments = this._assignments.asReadonly();
  readonly loading = this._loading.asReadonly();

  // Computed signal for assignments grouped by location and day
  readonly assignmentsByLocationAndDay = computed(() => {
    const assignments = this._assignments();
    const children = this._children();
    const planning = this._planning();

    if (!planning) return new Map<string, DayOfWeek[]>();

    const locationMap = new Map<string, DayOfWeek[]>();

    // Get all unique location IDs
    const locationIds = [...new Set(assignments.map((a) => a.locationId))];

    locationIds.forEach((locationId) => {
      const locationAssignments = assignments.filter((a) => a.locationId === locationId);
      const daysOfWeek = this.mapAssignmentsToDays(locationAssignments, children);
      locationMap.set(locationId, daysOfWeek);
    });

    return locationMap;
  });

  // Load planning data
  loadPlanning(): void {
    this._loading.set(true);
    this.plannerService.getPlanning().subscribe({
      next: (planning) => {
        this._planning.set(planning);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading planning:', error);
        this._loading.set(false);
      },
    });
  }

  // Load locations
  loadLocations(): void {
    this._loading.set(true);
    this.locationService.getLocations().subscribe({
      next: (locations) => {
        this._locations.set(locations);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this._loading.set(false);
      },
    });
  }

  // Load children (cached globally)
  loadChildren(): void {
    if (this._children().length > 0) {
      return; // Already loaded
    }

    this._loading.set(true);
    this.childrenService.getChildren().subscribe({
      next: (children) => {
        this._children.set(children);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading children:', error);
        this._loading.set(false);
      },
    });
  }

  // Load assignments for specific planning/location
  loadAssignments(planningId: string, locationId: string): void {
    this._loading.set(true);
    this.assignmentService.getAssignmentsByLocationIdAndPlanningId(planningId, locationId).subscribe({
      next: (assignments) => {
        // Merge assignments into existing state (keep other locations' assignments)
        const existingAssignments = this._assignments().filter(
          (a) => !(a.planningId === planningId && a.locationId === locationId),
        );
        this._assignments.set([...existingAssignments, ...assignments]);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading assignments:', error);
        this._loading.set(false);
      },
    });
  }

  // Create assignment with optimistic update
  createAssignment(dto: CreateAssignment): void {
    // Optimistic update: create temporary assignment
    const tempId = `temp-${Date.now()}`;
    const optimisticAssignment: Assignment = {
      id: tempId,
      ...dto,
      note: dto.note || '',
    };

    this._assignments.update((assignments) => [...assignments, optimisticAssignment]);

    // Persist to backend
    this.assignmentService.createAssignment(dto).subscribe({
      next: (serverAssignment) => {
        // Replace temporary assignment with server response
        this._assignments.update((assignments) =>
          assignments.map((a) => (a.id === tempId ? serverAssignment : a)),
        );
      },
      error: (error) => {
        console.error('Error creating assignment:', error);
        // Rollback optimistic update
        this._assignments.update((assignments) => assignments.filter((a) => a.id !== tempId));
      },
    });
  }

  // Delete assignment with optimistic update
  deleteAssignment(assignmentId: string): void {
    // Optimistic update: remove from state immediately
    const removedAssignment = this._assignments().find((a) => a.id === assignmentId);
    this._assignments.update((assignments) => assignments.filter((a) => a.id !== assignmentId));

    // Persist to backend
    this.assignmentService.deleteAssignment(assignmentId).subscribe({
      next: () => {
        // Successfully deleted, no action needed (already removed optimistically)
      },
      error: (error) => {
        console.error('Error deleting assignment:', error);
        // Rollback: restore the assignment
        if (removedAssignment) {
          this._assignments.update((assignments) => [...assignments, removedAssignment]);
        }
      },
    });
  }

  // Invalidate children cache (e.g., after import)
  invalidateChildren(): void {
    this._children.set([]);
    this.loadChildren();
  }

  // Invalidate assignments cache for specific planning/location
  invalidateAssignments(planningId: string, locationId: string): void {
    this._assignments.update((assignments) =>
      assignments.filter((a) => !(a.planningId === planningId && a.locationId === locationId)),
    );
    this.loadAssignments(planningId, locationId);
  }

  // Helper method to map assignments to days structure
  private mapAssignmentsToDays(assignments: Assignment[], children: Child[]): DayOfWeek[] {
    const daysOfWeek: DayOfWeek[] = [
      { key: 'MON', label: 'Monday', short: 'Mon', children: [] },
      { key: 'TUE', label: 'Tuesday', short: 'Tue', children: [] },
      { key: 'WED', label: 'Wednesday', short: 'Wed', children: [] },
      { key: 'THU', label: 'Thursday', short: 'Thu', children: [] },
      { key: 'FRI', label: 'Friday', short: 'Fri', children: [] },
    ];

    assignments.forEach((assignment) => {
      const child = children.find((c) => c.id === assignment.childId);
      if (child && daysOfWeek[assignment.dayOfWeek]) {
        daysOfWeek[assignment.dayOfWeek].children.push({
          id: child.id,
          name: `${child.firstName} ${child.lastName}`,
          assignmentId: assignment.id,
          group: child.group,
        });
      }
    });

    return daysOfWeek;
  }
}