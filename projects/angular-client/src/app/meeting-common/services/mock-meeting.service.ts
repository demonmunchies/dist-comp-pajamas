import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MeetingInfo } from '../models/meeting-info.model';
import { MeetingSearchParams } from '../models/meeting-search-params.model';
import { MeetingServiceInterface } from './meeting-service.interface';

@Injectable({
  providedIn: 'root'
})
export class MockMeetingService implements MeetingServiceInterface {

  private readonly db: MeetingInfo[] = [
    {
      meeting_id: "1",
      title: "1st Design Meeting",
      start_date: new Date(2020, 10, 15, 1, 0, 0).toISOString(),
      end_date: new Date(2020, 10, 15, 2, 17, 0).toISOString(),
      creator_id: "1",
      participant_ids: ["1", "2"],
      creation_date: new Date(2020, 10, 15, 2, 17, 0).toISOString(),
    },
    {
      meeting_id: "2",
      title: "1st Status Meeting",
      start_date: new Date(2020, 11, 21, 9, 0, 0).toISOString(),
      end_date: new Date(2020, 11, 21, 9, 35, 0).toISOString(),
      creator_id: "1",
      participant_ids: ["1", "2", "3"],
      creation_date: new Date(2020, 10, 15, 2, 17, 0).toISOString(),
    }
  ];

  constructor() { }
  
  put(meeting: Partial<MeetingInfo>): Observable<MeetingInfo> {
    throw new Error('Method not implemented.');
  }

  post(title: string, startDate: string, endDate: string, participantIds: string[]): Observable<{ meeting_id: string }> {
    throw new Error('Method not implemented.');
  }

  search(params: MeetingSearchParams): Observable<MeetingInfo[]> {
    return of([...this.db]);
  }

  get(id: string): Observable<MeetingInfo> {
    return of(this.db.find(t => t.meeting_id === id));
  }
}
