import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { AddGroupComponent } from '../add-group/add-group.component';
import { ExistingGroupComponent } from '../existing-group/existing-group.component';
import { PayoutsService } from 'src/app/services/payout/payouts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent {

  showAdd: boolean = false;
  durationInSeconds = 1;
  payGroup: any = [];
  currentPage = 1;
  itemsPerPage = 3;
  totalRecords: number = 0;
  constructor(private _commonService: CommonService,
    private _payService: PayoutsService,
    private router: Router) {

  }
  ngOnInit() {
    this.getPaylist();
  }

  openExpense(id: any) {
    this.router.navigate([`/expense/detail/${id}`])
  }


  onScroll = () => {
    if (this.totalRecords >= 5) {
      this.currentPage++;
      this.getPaylist();
    }
  }


  getPaylist() {
    let data = { page: this.currentPage, limit: this.itemsPerPage }
    this._payService.getPaygroup(data).subscribe({
      next: (res: any) => {
        this.payGroup = [...this.payGroup, ...res.data.data];
        this.totalRecords = res.data.pagination.totalRecords;
      }, error: (err) => {
        console.log('err: ', err);
        this._commonService.showSnackbar(err.error.message ? err.error.message : "Something went wrong", false, this.durationInSeconds);
      }
    })
  }

  toggleadd() {
    this.showAdd = !this.showAdd
  }

  openDialog(id: number) {
    this.showAdd = false;
    if (id === 1) {
      this._commonService.openDialog(ExistingGroupComponent, true, '');
    }
    else {
      this._commonService.openDialog(AddGroupComponent, true, '').subscribe(res => {
        if (res === 'Submitted')
          this.payGroup = [];
        this.getPaylist();
      });;
    }
  }



}
