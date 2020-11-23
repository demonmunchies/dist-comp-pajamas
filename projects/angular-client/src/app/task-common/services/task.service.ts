import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchParams } from 'src/app/search-common/models/search-params.model';
import { SearchResponse } from 'src/app/search-common/models/search-response.model';
import { TaskInfo } from '../models/task-info.model';
import { TaskServiceInterface } from './task-service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements TaskServiceInterface {

  constructor(private http: HttpClient) { }

  search(params: SearchParams): Observable<SearchResponse<TaskInfo>> {
    let httpParams = new HttpParams();
    // TODO add params to httpParams
    return this.http.get<SearchResponse<TaskInfo>>(`http://localhost:8080/tasks/filter/`, { params: httpParams });
  }

  get(id: string): Observable<TaskInfo> {
    return this.http.get<TaskInfo>(`http://localhost:8080/tasks/${id}`);
  }
}
