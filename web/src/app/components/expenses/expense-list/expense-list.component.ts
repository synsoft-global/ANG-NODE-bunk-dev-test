import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'cypress/types/jquery';
import { AddGroupComponent } from '../../paygroup/add-group/add-group.component';
import { CommonService } from 'src/app/services/common/common.service';
import { loginFormError } from 'src/app/services/global/app.constant';
import { LocaldataService } from 'src/app/services/localdata/localdata.service';
import { PayoutsService } from 'src/app/services/payout/payouts.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent {
  @ViewChild('shareGroup')
  shareGroup!: TemplateRef<any>;
  id: any;
  loginFormError = loginFormError;
  shareForm: FormGroup;
  groupId: string = '';
  selectedTabIndex: any = 0;
  shareUrl: string = '';
  durationInSeconds = 1;
  announcer = inject(LiveAnnouncer);
  keywords: any = [];
  expenses: any = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalBalance: any = [];
  groupTotal: number = 0;
  myBalance: number = 0;
  groupTitle: string = '';
  groupMember: any[] = [];
  totalRecords: number = 0;
  chips: string[] = [];
  isLoading = false;
  constructor(private location: Location,
    private _commonService: CommonService,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _payService: PayoutsService,
    private _localService: LocaldataService

  ) {
    this.shareForm = this._fb.group({
      url: ['', [Validators.required]],
      emails: ['', [Validators.required]],
      groupId: ['']
    });

  }

  ngOnInit() {
    this.groupId = this.route.snapshot.params['groupId'];
    let data = JSON.parse(this._localService.get('userData'))
    this.id = data._id;
    this.getExpense(this.groupId);
    this.getBalance(this.groupId);
    this.shareUrl = `http://localhost:4200/group/join/${this.groupId}`;
    this.shareForm.patchValue({
      url: this.shareUrl
    });
  }


  back() {
    this.location.back();
  }


  openDialog(id: number) {
    if (id === 1) {
      this._commonService.openDialog(this.shareGroup, true, '');
    }
    else {
      this._commonService.openDialog(AddGroupComponent, true, this.groupId).subscribe(res => {
        if (res === 'Submitted') {
          this.expenses = [];
          this.currentPage = 1;
          this.getExpense(this.groupId);
          this.getBalance(this.groupId);

        }
      });
    }
  }


  trackKeyword(index: number, keyword: string): string {
    return keyword;
  }


  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword}`);
    }
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.keywords.push(value);
    }
    event.chipInput!.clear();
  }


  onScroll() {
    if (this.totalRecords >= 10) {
      this.currentPage++;
      this.getExpense(this.groupId);
    }
  }


  getExpense(id: any) {
    let data = { page: this.currentPage, limit: this.itemsPerPage };
    this._payService.getExpenseByGroup(id, data).subscribe({
      next: (res: any) => {
        this.totalRecords = res.pagination?.totalRecords;
        this.expenses = [...this.expenses, ...res.data];
        this.groupTitle = res.data[0].groupInfo.title;
        this.groupMember = res.data[0].groupInfo.participants;
      }, error: (error) => {
        console.log('error: ', error);
      }
    });
  }


  getBalance(id: any) {
    this._payService.getBalance(id).subscribe({
      next: (res: any) => {
        this.totalBalance = res.data;
        const user = this.totalBalance.find((item: any) => item.id === this.id);
        this.groupTotal = user.GroupTotal;
        this.myBalance = user.myTotal;
      }, error: (error) => {
        console.log('error: ', error);
      }
    });
  }


  deleteExpense(id: any) {
    this._payService.deleteExpense(id).subscribe({
      next: (res: any) => {
        this._commonService.showSnackbar(res.message, true, this.durationInSeconds);
        this.currentPage = 1;
        this.expenses = [];
        this.getExpense(this.groupId);
        this.getBalance(this.groupId);
      }, error: (error) => {
        this._commonService.showSnackbar(error.error.error ? error.error.error : "Something went wrong", false, this.durationInSeconds);
      }
    });
  }


  deleteGroup(id: any) {
    this._payService.deletePayGroup(id).subscribe({
      next: (res: any) => {
        this.router.navigate(['/group/list']);
        this._commonService.showSnackbar(res.message, true, this.durationInSeconds);
      }, error: (error) => {
        this._commonService.showSnackbar(error.error.error ? error.error.error : "Something went wrong", false, this.durationInSeconds);
      }
    });
  }


  sendEmail() {
    this.shareForm.markAllAsTouched();
    if (this.shareForm.valid) {
      this._commonService.closeDialog();
      let data = this.shareForm.value;
      data.groupId = this.groupId;
      this._payService.invitFriend(data).subscribe({
        next: (res: any) => {
          this._commonService.showSnackbar(res.message, true, this.durationInSeconds);

        }, error: (error) => {
          this._commonService.showSnackbar(error.error.error ? error.error.error : "Something went wrong", false, this.durationInSeconds);
        }
      });
    }
  }


}
