import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyMeetingsModule } from './my-meetings/my-meetings.module';
import { MeetingService } from './meeting-common/services/meeting.service';
import { MockMeetingService } from './meeting-common/services/mock-meeting.service';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { MyTasksModule } from './my-tasks/my-tasks.module';
import { TaskService } from './task-common/services/task.service';
import { MockTaskService } from './task-common/services/mock-task.service';

@NgModule({
  declarations: [
    AppComponent,
    MyTasksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MyMeetingsModule,
    MyTasksModule
  ],
  providers: [
    { provide: MeetingService, useClass: MockMeetingService },
    { provide: TaskService, useClass: MockTaskService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
