import { Component } from '@angular/core';
import { LocaldataService } from '../services/localdata/localdata.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  name: string = '';
  constructor(private _localService: LocaldataService,
    private router: Router,
    private _commonService: CommonService) {

  }

  ngOnInit() {
    let data = this._localService.get('userData');
    data = JSON.parse(data);
    this.name = data.userName;
  }


  logout() {
    this._commonService.closeDialog();
    this._localService.del('userToken');
    this._localService.del('userData');
    this.router.navigate(['/login']);
  }
}
