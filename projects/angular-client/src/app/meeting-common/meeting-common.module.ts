import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingsListComponent } from './components/meetings-list/meetings-list.component';
import { SearchCommonModule } from '../search-common/search-common.module';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';

const declarations = [
  MeetingsListComponent
]

@NgModule({
  declarations: declarations,
  imports: [
    CommonModule,
    RouterModule,
    SearchCommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatListModule,
  ],
  exports: [...declarations]
})
export class MeetingCommonModule { }
