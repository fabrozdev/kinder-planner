import { computed, inject, Injectable, signal } from '@angular/core';
import { PlanningWithAssignment } from '@/app/shared/models/planning';
import { Location } from '@/app/shared/models/location';
import { Child } from '@/app/shared/models/child';
import { Assignment, CreateAssignment } from '@/app/shared/models/assignment';
import { PlannerService } from './planner.service';
import { LocationService } from './location.service';
import { ChildrenService } from './children.service';
import { AssignmentService } from './assignment.service';
import { DayOfWeek, WEEKDAY } from '@/app/shared/models/day-of-week';

@Injectable({
  providedIn: 'root',
})
export class PlanningStateService {
  private readonly plannerService = inject(PlannerService);
  private readonly locationService = inject(LocationService);
  private readonly childrenService = inject(ChildrenService);
  private readonly assignmentService = inject(AssignmentService);

  // Core state signals
  private readonly _locations = signal<Location[]>([]);
  private readonly _children = signal<Child[]>([]);
  private readonly _plannings = signal<PlanningWithAssignment[]>([]);
  private readonly _loading = signal<boolean>(false);

  // Track which location IDs have been loaded
  private readonly loadedLocationKeys = new Set<string>();

  // Exposed read-only signals
  readonly locations = this._locations.asReadonly();
  readonly children = this._children.asReadonly();
  readonly plannings = this._plannings.asReadonly();
  readonly loading = this._loading.asReadonly();

  // Computed signal for assignments grouped by location and day
  readonly assignmentsByLocationAndDay = computed(() => {
    const plannings = this._plannings();
    const locations = this._locations();

    const locationMap = new Map<string, DayOfWeek[]>();

    // For each location, find its planning and group assignments to days
    locations.forEach((location) => {
      const planning = plannings.find((p) => p.locationId.includes(location.id));
      if (planning?.assignments) {
        const daysOfWeek = this.groupAssignmentByDay(planning.assignments);
        locationMap.set(location.id, daysOfWeek);
      }
    });

    return locationMap;
  });

  // Load planning data for a specific location
  loadPlanning(locationId: string): void {
    // Check if already loaded
    if (this.loadedLocationKeys.has(locationId)) {
      return;
    }

    const month = 11;
    const year = 2025;

    this.loadedLocationKeys.add(locationId);
    this._loading.set(true);

    this.plannerService.getPlanningByMonthAndYearAndLocationId(month, year, locationId).subscribe({
      next: (planning) => {
        // Add or update planning in the array
        this._plannings.update((plannings) => {
          const index = plannings.findIndex((p) => p.id === planning.id);
          if (index >= 0) {
            // Update existing
            const updated = [...plannings];
            updated[index] = planning;
            return updated;
          } else {
            // Add new
            return [...plannings, planning];
          }
        });
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading planning:', error);
        this.loadedLocationKeys.delete(locationId);
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
        // Sort children alphabetically by first name
        const sortedChildren = [...children].sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
        this._children.set(sortedChildren);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading children:', error);
        this._loading.set(false);
      },
    });
  }

  // Create assignment with optimistic update
  createAssignment(dto: CreateAssignment): void {
    // Find the child for the optimistic assignment
    const child = this._children().find((c) => c.id === dto.childId);
    if (!child) {
      console.error('Child not found for assignment:', dto.childId);
      return;
    }

    // Check if child already has an assignment for this day and location
    const planning = this._plannings().find((p) => p.locationId.includes(dto.locationId));
    if (planning) {
      const existingAssignment = planning.assignments.find(
        (a) => a.childId === dto.childId && a.dayOfWeek === dto.dayOfWeek
      );
      if (existingAssignment) {
        console.warn('Child already has an assignment for this day:', `${child.firstName} ${child.lastName}`);
        return;
      }
    }

    // Optimistic update: create temporary assignment
    const tempId = `temp-${Date.now()}`;
    const optimisticAssignment: Assignment = {
      id: tempId,
      ...dto,
      child,
      note: dto.note || '',
    };

    // Add to the appropriate planning's assignments
    this._plannings.update((plannings) =>
      plannings.map((planning) => {
        // Match by planning ID (planning ID should match dto.planningId or contain location ID)
        if (planning.locationId.includes(dto.locationId)) {
          return {
            ...planning,
            assignments: [...(planning.assignments || []), optimisticAssignment],
          };
        }
        return planning;
      }),
    );

    // Persist to backend
    this.assignmentService.createAssignment(dto).subscribe({
      next: (serverAssignment) => {
        // Replace temporary assignment with server response
        this._plannings.update((plannings) =>
          plannings.map((planning) => {
            if (planning.locationId.includes(dto.locationId)) {
              return {
                ...planning,
                assignments: planning.assignments.map((a) =>
                  a.id === tempId ? serverAssignment : a,
                ),
              };
            }
            return planning;
          }),
        );
      },
      error: (error) => {
        console.error('Error creating assignment:', error);
        // Rollback optimistic update
        this._plannings.update((plannings) =>
          plannings.map((planning) => {
            if (planning.locationId.includes(dto.locationId)) {
              return {
                ...planning,
                assignments: planning.assignments.filter((a) => a.id !== tempId),
              };
            }
            return planning;
          }),
        );
      },
    });
  }

  // Delete assignment with optimistic update
  deleteAssignment(assignmentId: string): void {
    // Find and store the removed assignment for potential rollback
    let removedAssignment: Assignment | undefined;
    let planningId: string | undefined;

    // Optimistic update: remove from state immediately
    this._plannings.update((plannings) =>
      plannings.map((planning) => {
        const assignmentIndex = planning.assignments.findIndex((a) => a.id === assignmentId);
        if (assignmentIndex >= 0) {
          removedAssignment = planning.assignments[assignmentIndex];
          planningId = planning.id;
          return {
            ...planning,
            assignments: planning.assignments.filter((a) => a.id !== assignmentId),
          };
        }
        return planning;
      }),
    );

    // Persist to backend
    this.assignmentService.deleteAssignment(assignmentId).subscribe({
      next: () => {
        // Successfully deleted, no action needed (already removed optimistically)
      },
      error: (error) => {
        console.error('Error deleting assignment:', error);
        // Rollback: restore the assignment
        if (removedAssignment && planningId) {
          this._plannings.update((plannings) =>
            plannings.map((planning) => {
              if (planning.id === planningId) {
                return {
                  ...planning,
                  assignments: [...planning.assignments, removedAssignment!],
                };
              }
              return planning;
            }),
          );
        }
      },
    });
  }

  // Invalidate children cache (e.g., after import)
  invalidateChildren(): void {
    this._children.set([]);
    this.loadChildren();
  }

  // Invalidate planning cache for specific location
  invalidatePlanning(locationId: string): void {
    this.loadedLocationKeys.delete(locationId);
    this.loadPlanning(locationId);
  }

  // Helper method to map assignments to days structure
  private groupAssignmentByDay(assignments: Assignment[]): DayOfWeek[] {
    const daysOfWeek: DayOfWeek[] = WEEKDAY.map((day) => ({
      ...day,
      assignments: [],
    }));

    assignments.forEach((assignment) => {
      if (daysOfWeek[assignment.dayOfWeek]) {
        daysOfWeek[assignment.dayOfWeek].assignments.push(assignment);
      }
    });

    // Sort assignments within each day alphabetically by child's first name
    daysOfWeek.forEach((day) => {
      day.assignments.sort((a, b) =>
        a.child.firstName.localeCompare(b.child.firstName)
      );
    });

    return daysOfWeek;
  }
}
