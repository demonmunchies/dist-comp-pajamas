import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { MeetingInfo } from '../models/meeting-info.model';
import { MeetingSearchParams } from '../models/meeting-search-params.model';
import { MeetingServiceInterface } from './meeting-service.interface';

@Injectable({
  providedIn: 'root'
})
export class MeetingService implements MeetingServiceInterface {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  put(meeting: Partial<MeetingInfo>): Observable<MeetingInfo> {
    const data = { ...meeting, ...{ token: this.auth.token, user_id: this.auth.userId } }
    return this.http.put<MeetingInfo>(`http://localhost:5000/meetings/update`, data);
  }

  post(title: string, startDate: string = "", endDate: string = "", participantIds: string[] = []): Observable<{ meeting_id: string }> {
    const data = {
      title: title,
      start_date: startDate,
      end_date: endDate,
      participant_ids: participantIds,
      user_id: this.auth.userId,
      token: this.auth.token
    }
    return this.http.post<{ meeting_id: string }>(`http://localhost:5000/meetings/add`, data);
  }

  search(params: MeetingSearchParams): Observable<MeetingInfo[]> {
    let httpParams = new HttpParams();
    // TODO add params to httpParams
    return this.http.get<MeetingInfo[]>(`http://localhost:5000/meetings`, { params: httpParams });
  }

  get(id: string): Observable<MeetingInfo> {
    const data = {
      meeting_id: id,
      user_id: this.auth.userId,
      token: this.auth.token
    };
    return this.http.post<{ data: MeetingInfo, status: string }>(`http://localhost:5000/meetings/get`, data).pipe(
      map(response => {
        return response.data;
      }));
  }
}
