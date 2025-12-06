import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment, CreateAssignment } from '@/app/shared/models/assignment';
import { Capacity, CreatePlanningCapacity } from '@/app/shared/models/capacity';

@Injectable({
  providedIn: 'root',
})
export class CapacitiesService {
  private readonly http = inject(HttpClient);

  upsertCapacitiesByPlanningId(planningCapacity: CreatePlanningCapacity): Observable<Capacity[]> {
    return this.http.post<Capacity[]>(`/capacities/planning`, planningCapacity);
  }
}
