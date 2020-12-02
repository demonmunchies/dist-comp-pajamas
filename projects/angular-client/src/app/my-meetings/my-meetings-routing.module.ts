import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyMeetingsComponent } from './my-meetings.component';

const routes: Routes = [{ path: 'my-meetings', component: MyMeetingsComponent, data: { routeTitle: "Meetings" } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyMeetingsRoutingModule { }
