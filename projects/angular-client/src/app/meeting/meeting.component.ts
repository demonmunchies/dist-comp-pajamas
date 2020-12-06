import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { MeetingInfo } from '../meeting-common/models/meeting-info.model';
import { MeetingService } from '../meeting-common/services/meeting.service';
import { TaskInfo } from '../task-common/models/task-info.model';

@Component({
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  meeting: MeetingInfo;
  timeElapsed: number = 0;
  interval;

  get canStart(): boolean {
    return !this.meeting.start_date && !this.meeting.end_date && this.auth.userId === this.meeting.creator_id;
  }

  get isInProgress(): boolean {
    return this.meeting.start_date && !this.meeting.end_date;
  }

  get isDone(): boolean {
    return !!(this.meeting.start_date && this.meeting.end_date);
  }

  get canStop(): boolean {
    return this.isInProgress && this.auth.userId === this.meeting.creator_id;
  }

  get canJoin(): boolean {
    return this.isInProgress && this.auth.userId !== this.meeting.creator_id;
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

  get transcript(): { timestamp: string, participant_index: number, text: string }[] {
    return [{
      timestamp: "00:00:10",
      participant_index: 0,
      text: `Let me just summarize the main points of the last meeting. We began the meeting by approving the 
      changes in our sales reporting system discussed on May 30th. After briefly revising the changes that will take place, 
      we moved on to a brainstorming session concerning after customer support improvements. You'll find a copy of the main ideas
       developed and discussed in these sessions in the photocopies in front of you. The meeting was declared closed at 11.30.`
    },
    {
      timestamp: "00:00:45",
      participant_index: 2,
      text: `It does pay to keep up with the customers' demand. Everybody likes our products and services. Even though it is sometimes
       very difficult to please everybody, it is fine with me because I love this company, and I want to see it prosper.`
    }]
  }

  get tasks(): TaskInfo[] {
    return [
      { id: "1", title: "summarize the main points of the last meeting." },
      { id: "2", title: "approving the changes in our sales" },
      { id: "3", title: "briefly revising the changes that will take place" },
      { id: "4", title: "brainstorming session concerning after customer support improvements" },
      { id: "4", title: "find a copy of the main ideas developed and discussed in these sessions in the photocopies in front you" },
    ]
  }

  get participants() {
    return [this.auth.userName, "Tom Robbins", "Jack Peterson", "Mark Brown"];
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timeElapsed++;
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }


  totalMinutes(startDate: string, endDate?: string): number {
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs();
    return end.diff(start, 'minute');
  }

  constructor(
    private meetingService: MeetingService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (!this.auth.loggedIn) {
      this.router.navigate(["login"]); // TODO move to RouteGuard.
    }
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
      this.startTimer();
    })
  }

}
