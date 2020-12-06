import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTasksRoutingModule } from './my-tasks-routing.module';
import { MatListModule } from '@angular/material/list';
import { MyTasksComponent } from './my-tasks.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [MyTasksComponent],
  imports: [
    CommonModule,
    MyTasksRoutingModule,
    MatListModule,
    MatIconModule,
    MatCardModule
  ]
})
export class MyTasksModule { }
