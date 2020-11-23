import { Component, OnInit } from '@angular/core';
import { MeetingInfo } from '../meeting-common/models/meeting-info.model';
import { MeetingSearchParams } from '../meeting-common/models/meeting-search-params.model';
import { MeetingService } from '../meeting-common/services/meeting.service';

@Component({
  selector: 'app-my-meetings',
  templateUrl: './my-meetings.component.html',
  styleUrls: ['./my-meetings.component.scss']
})
export class MyMeetingsComponent implements OnInit {

  meetings: MeetingInfo[] = [];

  constructor(private meetingService: MeetingService) { }

  ngOnInit(): void {
    const params: MeetingSearchParams = {
      offset: 0,
      rows: 10
    };
    this.meetingService.search(params).subscribe(response => {
      this.meetings = response.results;
    });
  }

}
