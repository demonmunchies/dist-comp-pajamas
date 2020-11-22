import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTasksRoutingModule } from './my-tasks-routing.module';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MyTasksRoutingModule,
    MatListModule,
  ]
})
export class MyTasksModule { }
