import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from '@/app/shared/models/assignment';
import { CreateAssignmentDto } from '@/app/shared/models/dto/create-assignment-dto';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private readonly http = inject(HttpClient);

  getAssignmentsByLocationIdAndPlanningId(
    planningId: string,
    locationId: string,
  ): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`/assignments`, {
      params: {
        planningId,
        locationId,
      },
    });
  }

  createAssignment(assignmentDto: CreateAssignmentDto): Observable<Assignment> {
    return this.http.post<Assignment>(`/assignments`, assignmentDto);
  }

  deleteAssignment(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`/assignments/${id}`);
  }
}
