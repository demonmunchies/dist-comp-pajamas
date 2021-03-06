import { Component, Input, OnInit } from '@angular/core';
import { MeetingInfo } from '../../models/meeting-info.model';
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrls: ['./meetings-list.component.scss']
})
export class MeetingsListComponent implements OnInit {

  @Input() meetings: MeetingInfo[] = [];

  isInProgress(meeting: MeetingInfo): boolean {
    return meeting.start_date && !meeting.end_date;
  }

  isDone(meeting: MeetingInfo): boolean {
    return !!(meeting.start_date && meeting.end_date);
  }

  status(meeting: MeetingInfo): string {
    if (this.isDone(meeting)) {
      return "Completed";
    } else if (this.isInProgress(meeting)) {
      return "In Progress";
    } else {
      return "Not Started";
    }
  }

  totalMinutes(startDate: string, endDate?: string): number {
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs();
    return end.diff(start, 'minute');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
