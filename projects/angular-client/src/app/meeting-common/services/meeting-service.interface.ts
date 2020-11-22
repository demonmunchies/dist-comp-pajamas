import { Observable } from 'rxjs';
import { SearchResponse } from 'src/app/search-common/models/search-response.model';
import { MeetingInfo } from '../models/meeting-info.model';
import { MeetingSearchParams } from '../models/meeting-search-params.model';

export interface MeetingServiceInterface {
    search(params: MeetingSearchParams): Observable<SearchResponse<MeetingInfo>>;
    get(id: string): Observable<MeetingInfo>;
}