import { Observable } from 'rxjs';
import { MeetingInfo } from '../models/meeting-info.model';
import { MeetingSearchParams } from '../models/meeting-search-params.model';

export interface MeetingServiceInterface {
    search(params: MeetingSearchParams): Observable<MeetingInfo[]>;
    get(id: string): Observable<MeetingInfo>;
    put(meeting: Partial<MeetingInfo>): Observable<MeetingInfo>
    post(title: string, startDate: string, endDate: string, participantIds: string[]): Observable<{ meeting_id: string }>;
}