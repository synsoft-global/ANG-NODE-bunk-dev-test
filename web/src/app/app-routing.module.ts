import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayoutComponent } from './payout/payout.component';
const routes: Routes = [
  { path: '', component: PayoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
