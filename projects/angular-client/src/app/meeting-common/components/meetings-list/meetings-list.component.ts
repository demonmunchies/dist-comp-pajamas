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

  totalMinutes(startDate: Date, endDate: Date): number {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return start.diff(end, 'minute');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
