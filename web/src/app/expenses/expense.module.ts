import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpenseComponent } from './expense.component';

@NgModule({
  declarations: [
    ExpenseDetailComponent,
    AddExpenseComponent,
    ExpenseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExpenseRoutingModule,
    ClipboardModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExpenseModule { }
