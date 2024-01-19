import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/services/common/common.service';
import { addExpenseFormError } from 'src/app/services/global/app.constant';
import { Validator } from 'src/app/services/global/validator';
import { LocaldataService } from 'src/app/services/localdata/localdata.service';
import { PayoutsService } from 'src/app/services/payout/payouts.service';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.scss']
})
export class JoinGroupComponent {
  @ViewChild('joinGroup', { static: true })
  joinGroup!: TemplateRef<any>;
  joinForm: FormGroup;
  groupId: any;
  expenseFormError = addExpenseFormError;
  id: any;
  userId: any = '';
  submitted = false;
  userList: any = [];
  isLoggedIn: boolean = false;
  durationInSeconds = 1;
  constructor(private _payService: PayoutsService,
    private _localService: LocaldataService,
    private _commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,

  ) {
    this.joinForm = this._fb.group({
      userName: ['', [Validator.checkboxValidator]],
      groupId: [''],
      userId: ['']
    });

  }


  ngOnInit() {
    this.groupId = this.route.snapshot.params['groupId'];
    this.isLoggedIn = this._localService.get('userToken');
    if (this.isLoggedIn) {
      let data = JSON.parse(this._localService.get('userData'))
      this.userId = data._id;
      this.getUsers();
      this.openDialog();
    } else {
      this.router.navigate(['/login'])
    }
  }


  openDialog() {
    this._commonService.openDialog(this.joinGroup, false, '');
  }


  getUsers() {
    this._payService.getUserByGroup(this.groupId).subscribe({
      next: (res: any) => {
        let data = res.data.groupId.participants;
        this.userList = data.filter((user: any) => user.isGroupJoin === false);
      }, error: (err) => {
        console.log('err: ', err);
      }
    });
  }


  onSelectionChange(event: any) {
    this.addGroup();
  }


  addGroup() {
    this.submitted = true;
    let data = this.joinForm.value;
    data.userName = this.joinForm.value.userName[0];
    data.userId = this.userId;
    data.groupId = this.groupId;
    this._payService.joinGroup(data).subscribe({
      next: (res: any) => {
        this._commonService.showSnackbar(res.message, true, this.durationInSeconds);
        this.router.navigate(['/group/list']);
      }, error: (error) => {
        this._commonService.showSnackbar(error.error.error ? error.error.error : "Something went wrong", false, this.durationInSeconds)
        this.router.navigate(['/login']);
      }
    })
  }



}
