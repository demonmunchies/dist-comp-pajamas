export interface MeetingInfo {
    id: string;
    startDate: Date;
    endDate: Date;
    title: string;
    creatorId: string;
    participantIds: string[];
}