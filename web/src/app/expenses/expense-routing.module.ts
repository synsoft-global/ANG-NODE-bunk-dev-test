import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpenseComponent } from './expense.component';

const routes: Routes = [
  {
    path: "",
    component: ExpenseComponent,
    children: [
      {
        path: 'detail/:id',
        component: ExpenseDetailComponent

      },
      {
        path: 'add/:id',
        component: AddExpenseComponent

      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
