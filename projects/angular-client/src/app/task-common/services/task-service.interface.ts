import { Observable } from 'rxjs';
import { SearchParams } from 'src/app/search-common/models/search-params.model';
import { SearchResponse } from 'src/app/search-common/models/search-response.model';
import { TaskInfo } from '../models/task-info.model';

export interface TaskServiceInterface {
    search(params: SearchParams): Observable<SearchResponse<TaskInfo>>;
    get(id: string): Observable<TaskInfo>;
}