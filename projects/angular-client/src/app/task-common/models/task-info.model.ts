export interface TaskInfo {
    id: string;
    title: string;
    description?: string;
    assigneeId?: string;
    startDate?: string;
    endDate?: string;
    skills?: string[];
}