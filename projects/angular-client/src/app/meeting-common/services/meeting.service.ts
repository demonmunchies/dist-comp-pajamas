import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResponse } from 'src/app/search-common/models/search-response.model';
import { MeetingInfo } from '../models/meeting-info.model';
import { MeetingSearchParams } from '../models/meeting-search-params.model';
import { MeetingServiceInterface } from './meeting-service.interface';

@Injectable({
  providedIn: 'root'
})
export class MeetingService implements MeetingServiceInterface {

  constructor(private http: HttpClient) { }

  search(params: MeetingSearchParams): Observable<SearchResponse<MeetingInfo>> {
    let httpParams = new HttpParams();
    // TODO add params to httpParams
    return this.http.get<SearchResponse<MeetingInfo>>(`http://localhost:8080/meetings/filter/`, { params: httpParams });
  }

  get(id: string): Observable<MeetingInfo> {
    return this.http.get<MeetingInfo>(`http://localhost:8080/meetings/${id}`);
  }
}
