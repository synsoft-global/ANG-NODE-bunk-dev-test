import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PayoutComponent } from '../payout/payout.component';
import { GroupListComponent } from './group-list/group-list.component';
import { PaygroupComponent } from './paygroup.component';
import { AddGroupComponent } from './add-group/add-group.component';

const routes: Routes = [
  {
    path: "",
    component: PaygroupComponent,
    children: [
      {
        path: '',
        component: GroupListComponent

      },
      {
        path: 'list',
        component: GroupListComponent

      },

    ]
  }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaygroupRoutingModule { }
