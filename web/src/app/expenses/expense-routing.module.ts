import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AddEditExpenseComponent } from './add-edit-expense/add-edit-expense.component';
import { ExpenseComponent } from './expense.component';

const routes: Routes = [
  {
    path: "",
    component: ExpenseComponent,
    children: [
      {
        path: 'detail/:groupId',
        component: ExpenseListComponent

      },
      {
        path: 'add/:groupId',
        component: AddEditExpenseComponent

      },
      {
        path: 'edit/:id/:groupId',
        component: AddEditExpenseComponent

      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
