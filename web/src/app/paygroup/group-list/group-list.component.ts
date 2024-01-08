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
  payGroup: any = [];
  constructor(private _common: CommonService,
    private _payService: PayoutsService,
    private router: Router) {

  }
  ngOnInit() {
    this.getPaylist();
  }

  handleCardClick(id: any) {
    this.router.navigate([`/expense/detail/${id}`])
  }

  getPaylist() {
    this._payService.getPaygroup().subscribe({
      next: (res: any) => {
        console.log('res: ', res);
        this.payGroup = res.data;
      }, error: (err) => {
        console.log('err: ', err);

      }
    })
  }

  toggleadd() {
    this.showAdd = !this.showAdd
  }

  openDialog(id: number) {
    if (id === 1) {
      this._common.openDialog(ExistingGroupComponent);
    }
    else {
      this._common.openDialog(AddGroupComponent);
    }
  }
}
