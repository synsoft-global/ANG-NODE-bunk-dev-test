import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayoutComponent } from './payout/payout.component';
import { authGuard } from './services/global/middleware/authguard/auth.guard';
import { noauthGuard } from './services/global/middleware/noauthguard/noauth.guard';
const routes: Routes = [

  {
    path: "",
    loadChildren: () =>
      import('./auth/auth.module').then((mod) => mod.AuthModule),
    canActivate: [noauthGuard]

  },
  {
    path: 'group',
    loadChildren: () =>
      import('./paygroup/paygroup.module').then((mod) => mod.PaygroupModule),
    canActivate: [authGuard]
  },
  {
    path: 'expense',
    loadChildren: () =>
      import('./expenses/expense.module').then((mod) => mod.ExpenseModule),
    canActivate: [authGuard]

  },

  {
    path: 'payout',
    component: PayoutComponent
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
