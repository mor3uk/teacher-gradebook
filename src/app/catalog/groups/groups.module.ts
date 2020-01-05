import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../../shared/shared.module';
import { GroupsComponent } from './groups.component';
import { GroupFormComponent } from './group-form/group-form.component';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
})
export class GroupsModule { }
