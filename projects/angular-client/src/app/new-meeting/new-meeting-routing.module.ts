import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewMeetingComponent } from './new-meeting.component';

const routes: Routes = [{ path: "new-meeting", component: NewMeetingComponent, data: { routeTitle: "Start a Meeting" } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMeetingRoutingModule { }
