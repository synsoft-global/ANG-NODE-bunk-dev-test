import { DatePipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { addExpenseFormError } from 'src/app/services/global/app.constant';
import { Validator } from 'src/app/services/global/validator';
import { PayoutsService } from 'src/app/services/payout/payouts.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-edit-expense.component.html',
  styleUrls: ['./add-edit-expense.component.scss']
})
export class AddEditExpenseComponent {
  addExpenseForm: FormGroup;
  expenseFormError = addExpenseFormError;
  durationInSeconds = 1;
  details: any = null;
  id: string = '';
  submitted = false;
  users: any = [];
  distributedAmount: any;
  checkedUserIds: string[] = [];
  // participantList:any
  groupId: any;
  constructor(
    private _fb: FormBuilder,
    private _payService: PayoutsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private _commonService: CommonService

  ) {
    this.addExpenseForm = this._fb.group({
      title: ['', [Validators.required]],
      amount: [null, [Validators.required]],
      paidBy: ['', [Validators.required]],
      paidAt: ['', [Validators.required]],
      groupId: [''],
      users: [[], [Validator.checkboxValidator]]

    })
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.groupId = this.route.snapshot.params['groupId'];
    this.getUsers();
    if (this.id) {
      setTimeout(() => {
        this.getExpenseDataById();
      }, 300);
    }

  }


  back() {
    this.location.back();
  }


  ngAfterViewInit() {
    if (!this.id) {
      setTimeout(() => {
        this.addExpenseForm.get('users')?.patchValue(this.users);
      }, 2000)
    };
    this.addExpenseForm.get('amount')?.valueChanges.subscribe(() => {
      this.distributeAmount();
    });


  };


  distributeAmount() {
    const enteredAmount = this.addExpenseForm.get('amount')?.value;
    this.distributedAmount = this.checkedUserIds.length > 0 ? enteredAmount / this.checkedUserIds.length : enteredAmount;
    this.users = this.users.map((item: any) => {
      item.amount = item.isChecked ? this.distributedAmount?.toFixed(2) : 0.00;
      return item
    });

  }


  getUsers() {
    this._payService.getUserByGroup(this.groupId).subscribe({
      next: (res: any) => {
        res.data = res.data.groupId.participants.map((participant: any) => {
          participant.isChecked
            = true;
          return participant;
        });

        this.users = res.data;
        this.addExpenseForm.get('users')?.patchValue(this.users);
        this.checkedUserIds = this.users;
      }, error: (err) => {
        console.log('err: ', err);

      }
    });
  }


  onSelectionChange(event: any) {
    const userId = event.source._value;
    this.users = this.users.map((item: any) => {
      let isExist = userId.filter((temp: any) => temp.id == item.id);
      if (isExist.length > 0) {
        item.isChecked = true;
        return item;
      } else {
        item.isChecked = false;
        return item;
      }
    });
    this.checkedUserIds = userId.length > 0 ? userId : [];
    this.distributeAmount();
  }


  submit() {
    this.submitted = true;
    if (this.addExpenseForm.valid) {
      if (this.id) {
        this.updateExpense(this.id)
      } else {
        let data = this.addExpenseForm.value;
        data.groupId = this.groupId;
        this._payService.addExpense(data).subscribe({
          next: (res: any) => {
            this.location.back();
            this._commonService.showSnackbar(res.message, true, this.durationInSeconds);
          }, error: (error) => {
            this._commonService.showSnackbar(error.error.error ? error.error.error : "Something went wrong", false, this.durationInSeconds);
          }
        });
      }
    }
  }


  getExpenseDataById() {
    this._payService.getExpenseDetail(this.id).subscribe({
      next: (res: any) => {
        this.details = res.data;
        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(this.details.paidAt, 'yyyy-MM-dd');

        this.users.map((user: any) => {
          user.isChecked = this.details.users.some((temp: any) => temp.id === user.id);
          return user;
        });
        let data = {
          title: this.details.title, amount: this.details.amount, paidBy: this.details.paidBy,
          paidAt: formattedDate, groupId: this.details.groupId, users: this.users
        };
        this.checkedUserIds = this.details.users;
        this.addExpenseForm.patchValue(data);
        this.distributeAmount();
      }, error: (error) => {
        console.log('error: ', error);

      }
    });
  }


  updateExpense(id: any) {
    let data = this.addExpenseForm.value;
    this._payService.updateExpense(id, data).subscribe({
      next: (res: any) => {
        this.location.back();
        this._commonService.showSnackbar(res.message, true, this.durationInSeconds);

      }, error: (error) => {
        this._commonService.showSnackbar(error.error.error ? error.error.error : "Something went wrong", false, this.durationInSeconds);
      }
    })
  }

}
