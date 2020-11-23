import { SearchParams } from 'src/app/search-common/models/search-params.model';

export interface MeetingSearchParams extends SearchParams {
    creatorId?: string;
    participantIds?: string[];
    startDate?: Date;
    endDate?: Date;
}