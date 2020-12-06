import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingComponent } from './meeting.component';

const routes: Routes = [{ path: "meeting/:id", component: MeetingComponent, data: { routeTitle: "Meeting Details" } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingRoutingModule { }
