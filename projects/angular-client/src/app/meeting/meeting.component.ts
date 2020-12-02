import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { MeetingInfo } from '../meeting-common/models/meeting-info.model';
import { MeetingService } from '../meeting-common/services/meeting.service';

@Component({
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  meeting: MeetingInfo;

  get canStart(): boolean {
    return !this.meeting.start_date && !this.meeting.end_date; //&& is creator.
  }

  get isInProgress(): boolean {
    return this.meeting.start_date && !this.meeting.end_date;
  }

  get isDone(): boolean {
    return !!(this.meeting.start_date && this.meeting.end_date);
  }

  get canStop(): boolean {
    return this.isInProgress; //&& is creator.
  }

  get canJoin(): boolean {
    return this.isInProgress; // && is participant.
  }

  get status(): string {
    if (this.isDone) {
      return "Completed";
    } else if (this.isInProgress) {
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

  constructor(private meetingService: MeetingService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.pipe(mergeMap(params => {
      const id = params?.id;
      return id ? this.meetingService.get(id) : throwError("Meeting ID required.")
    })).subscribe(meeting => {
      this.meeting = meeting;
    })
  }

  onStart() {
    const changes: Partial<MeetingInfo> = {
      meeting_id: this.meeting.meeting_id,
      start_date: dayjs().toISOString()
    };
    this.meetingService.put(changes).subscribe(meeting => {
      this.meeting = meeting;
    })
  }

}
