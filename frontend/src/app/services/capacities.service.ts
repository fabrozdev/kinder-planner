import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment, CreateAssignment } from '@/app/shared/models/assignment';
import { Capacity, CreatePlanningCapacity } from '@/app/shared/models/capacity';
import { DayOfWeekEnum } from '@/app/shared/models/day-of-week';

@Injectable({
  providedIn: 'root',
})
export class CapacitiesService {
  private readonly http = inject(HttpClient);

  upsertCapacitiesByPlanningId(planningCapacity: CreatePlanningCapacity): Observable<Capacity[]> {
    return this.http.post<Capacity[]>(`/capacities/planning`, planningCapacity);
  }

  getCapacitiesOfWeekByPlanningAndLocationId(
    planningId: string,
    locationId: string,
  ): Observable<Map<DayOfWeekEnum, Capacity>> {
    return this.http.get<Map<DayOfWeekEnum, Capacity>>(`/capacities`, {
      params: {
        planningId,
        locationId,
      },
    });
  }
}
