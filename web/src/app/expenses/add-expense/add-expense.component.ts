import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addExpenseFormError } from 'src/app/services/global/app.constant';
import { Validator } from 'src/app/services/global/validator';
import { PayoutsService } from 'src/app/services/payout/payouts.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent {
  addExpenseForm: FormGroup;
  expenseFormError = addExpenseFormError
  id: string = '';
  submitted = false;
  users = ['first', 'second'];
  distributedAmount: any  // users: any = [];
  checkedUserIds: string[] = [];
  constructor(
    private _fb: FormBuilder,
    private _payService: PayoutsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location

  ) {
    this.addExpenseForm = _fb.group({
      title: ['', [Validators.required]],
      amount: [null, [Validators.required]],
      paidBy: ['', [Validators.required]],
      paidAt: ['', [Validators.required]],
      groupId: [this.id, [Validators.required]],
      users: [null, [Validator.checkboxValidator]]

    })
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getUsers();
  }

  back() {
    this.location.back();
  }



  ngAfterViewInit() {
    this.addExpenseForm.get('amount')?.valueChanges.subscribe(() => {
      this.distributeAmount();
    });
  };
  distributeAmount() {
    // console.log(this.checkedUserIds.length);
    const totalUsers = this.users.length;
    const enteredAmount = this.addExpenseForm.get('amount')?.value;
    this.distributedAmount = enteredAmount / totalUsers;

  }

  getUsers() {
    this._payService.getUserByGroup(this.id).subscribe({
      next: (res: any) => {
        this.users = res.data[0].groupId.participants;

      }, error: (err) => {
        console.log('err: ', err);

      }
    });
  }


  onSelectionChange(event: any) {
    console.log(event);
    //   const userId = event.source._value;
    //   if (userId) {
    //     console.log('userId: ', userId);
    //     this.checkedUserIds.push(userId);
    //   } else {
    //     this.checkedUserIds = this.checkedUserIds.filter(id => id !== userId);
    //     console.log('this.checkedUserIds: else', this.checkedUserIds);
    //   }
    //   this.distributeAmount();
  }

  submit() {
    console.log(this.addExpenseForm.value);
    this.submitted = true;
    if (this.addExpenseForm.valid) {

    }

  }
}
