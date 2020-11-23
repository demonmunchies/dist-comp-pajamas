import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMeetingsRoutingModule } from './my-meetings-routing.module';
import { MyMeetingsComponent } from './my-meetings.component';
import { MeetingCommonModule } from '../meeting-common/meeting-common.module';


@NgModule({
  declarations: [MyMeetingsComponent],
  imports: [
    /* Angular modules */
    CommonModule,
    MeetingCommonModule,
    /* Project modules */
    MyMeetingsRoutingModule,
    /* 3rd Party modules */
 
  ]
})
export class MyMeetingsModule { }
