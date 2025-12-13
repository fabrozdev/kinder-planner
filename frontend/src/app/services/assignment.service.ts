import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment, CreateAssignment } from '@/app/shared/models/assignment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private readonly http = inject(HttpClient);

  createAssignment(assignmentDto: CreateAssignment): Observable<Assignment> {
    return this.http.post<Assignment>(`/assignments`, assignmentDto);
  }

  deleteAssignment(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`/assignments/${id}`);
  }
}
