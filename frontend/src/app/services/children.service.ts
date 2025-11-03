import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Child } from '../shared/models/child';

@Injectable({
  providedIn: 'root',
})
export class ChildrenService {
  private readonly http = inject(HttpClient);

  getChildren(): Observable<Child[]> {
    return this.http.get<Child[]>('/children');
  }
}
