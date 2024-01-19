import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayoutComponent } from './components/payout-old/payout.component';
import { authGuard } from './services/global/middleware/authguard/auth.guard';
import { noauthGuard } from './services/global/middleware/noauthguard/noauth.guard';
import { PageNotFoundComponent } from './components/helper/page-not-found/page-not-found.component';
const routes: Routes = [

  {
    path: "",
    loadChildren: () =>
      import('../app/components/auth/auth.module').then((mod) => mod.AuthModule),
    canActivate: [noauthGuard]

  },
  {
    path: 'group',
    loadChildren: () =>
      import('../app/components/paygroup/paygroup.module').then((mod) => mod.PaygroupModule),
    canActivate: [authGuard]
  },
  {
    path: 'expense',
    loadChildren: () =>
      import('../app/components/expenses/expense.module').then((mod) => mod.ExpenseModule),
    canActivate: [authGuard]

  },

  {
    path: 'payout',
    component: PayoutComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
