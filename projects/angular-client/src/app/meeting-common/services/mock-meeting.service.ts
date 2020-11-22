import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchResponse } from 'src/app/search-common/models/search-response.model';
import { MeetingInfo } from '../models/meeting-info.model';
import { MeetingSearchParams } from '../models/meeting-search-params.model';
import { MeetingServiceInterface } from './meeting-service.interface';

@Injectable({
  providedIn: 'root'
})
export class MockMeetingService implements MeetingServiceInterface {

  private readonly db: MeetingInfo[] = [
    {
      id: "1",
      title: "1st Design Meeting",
      startDate: new Date(2020, 10, 15, 1, 0, 0),
      endDate: new Date(2020, 10, 15, 2, 17, 0),
      creatorId: "1",
      participantIds: ["1", "2"]
    },
    {
      id: "2",
      title: "1st Status Meeting",
      startDate: new Date(2020, 11, 21, 9, 0, 0),
      endDate: new Date(2020, 11, 21, 9, 35, 0),
      creatorId: "1",
      participantIds: ["1", "2", "3"]
    }
  ];

  constructor() { }

  search(params: MeetingSearchParams): Observable<SearchResponse<MeetingInfo>> {
    return of({
      count: this.db.length,
      results: [...this.db]
    });
  }

  get(id: string): Observable<MeetingInfo> {
    return of(this.db.find(t => t.id === id));
  }
}
