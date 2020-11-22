export interface TaskInfo {
    id: string;
    title: string;
    description?: string;
    assigneeId?: string;
    startDate?: Date;
    endDate?: Date;
    skills?: string[];
}