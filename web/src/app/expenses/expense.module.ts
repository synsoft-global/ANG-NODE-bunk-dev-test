import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AddEditExpenseComponent } from './add-edit-expense/add-edit-expense.component';
import { ExpenseComponent } from './expense.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({
  declarations: [
    ExpenseListComponent,
    AddEditExpenseComponent,
    ExpenseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExpenseRoutingModule,
    ClipboardModule,
    InfiniteScrollModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExpenseModule { }
