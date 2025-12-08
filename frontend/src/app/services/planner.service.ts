import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Planning, PlanningWithAssignment } from '@/app/shared/models/planning';
import { Capacity, CreatePlanningCapacity } from '@/app/shared/models/capacity';
import { DayOfWeekEnum } from '@/app/shared/models/day-of-week';

@Injectable({
  providedIn: 'root',
})
export class PlannerService {
  private readonly http = inject(HttpClient);

  getPlanning(): Observable<Planning> {
    return this.http.get<Planning>('/planning');
  }

  getPlanningByMonthAndYearAndLocationId(
    month: number,
    year: number,
    locationId: string,
  ): Observable<PlanningWithAssignment> {
    return this.http.get<PlanningWithAssignment>(`/planning/${month}/${year}/${locationId}`);
  }

  upsertPlanningCapacity(planningCapacity: CreatePlanningCapacity): Observable<Capacity[]> {
    return this.http.post<Capacity[]>(`/planning/capacity`, planningCapacity);
  }

  getPlanningCapacityByLocationId(
    planningId: string,
    locationId: string,
  ): Observable<Map<DayOfWeekEnum, Capacity>> {
    return this.http.get<Map<DayOfWeekEnum, Capacity>>(`/planning/capacity`, {
      params: {
        planningId,
        locationId,
      },
    });
  }
}
