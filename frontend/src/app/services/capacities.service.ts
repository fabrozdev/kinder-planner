import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment, CreateAssignment } from '@/app/shared/models/assignment';

@Injectable({
  providedIn: 'root',
})
export class CapacitiesService {
  private readonly http = inject(HttpClient);

  createCapacity(assignmentDto: CreateAssignment): Observable<Assignment> {
    return this.http.post<Assignment>(`/capacities`, assignmentDto);
  }

  editCapacity(assignmentDto: CreateAssignment): Observable<Assignment> {
    return this.http.post<Assignment>(`/capacities`, assignmentDto);
  }
}
