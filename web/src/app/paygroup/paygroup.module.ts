import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './group-list/group-list.component';
import { PaygroupRoutingModule } from './paygroup-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { PaygroupComponent } from './paygroup.component';
import { ExistingGroupComponent } from './existing-group/existing-group.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { JoinGroupComponent } from './join-group/join-group.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";


@NgModule({
  declarations: [
    GroupListComponent,
    PaygroupComponent,
    ExistingGroupComponent,
    AddGroupComponent,
    JoinGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PaygroupRoutingModule,
    InfiniteScrollModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PaygroupModule { }
