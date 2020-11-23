import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchParams } from 'src/app/search-common/models/search-params.model';
import { SearchResponse } from 'src/app/search-common/models/search-response.model';
import { TaskInfo } from '../models/task-info.model';
import { TaskServiceInterface } from './task-service.interface';

@Injectable({
  providedIn: 'root'
})
export class MockTaskService implements TaskServiceInterface {

  constructor() { }

  private readonly db: TaskInfo[] = [
    { id: "1", title: "Angular Navigation Links", description: "Make angular app have navigation links to pages.", assigneeId: "1", startDate: new Date(), endDate: new Date() },
    { id: "2", title: "Angular My Meetings Page", description: "Make Meetings Page to display all past recorded meetings.", assigneeId: "1", startDate: new Date() },
    { id: "3", title: "Make Training Data", description: "Make more training data intents for model." }
  ]

  search(params: SearchParams): Observable<SearchResponse<TaskInfo>> {
    return of({
      count: this.db.length,
      results: [...this.db]
    });
  }

  get(id: string): Observable<TaskInfo> {
    return of(this.db.find(t => t.id === id));
  }
}
