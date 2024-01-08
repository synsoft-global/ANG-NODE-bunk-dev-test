import { Component } from '@angular/core';
import { LocaldataService } from './services/localdata/localdata.service';
import { Event, NavigationEnd, Router } from '@angular/router';
import { CommonService } from './services/common/common.service';


type Payout = {
  name: string;
  expenses: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'payout-management';
  isLogin: boolean = false;
  subscriptions: any[] = [];
  isLoading: any = false;
  constructor(
    private _commonService: CommonService,
    private _localService: LocaldataService,
    private router: Router
  ) { }


  ngOnInit() {
    this.subscriptions.push(this.router.events.subscribe((evt) => { this.onRouteChanged(evt); }));
  }

  ngAfterViewInit() {
    // Update the boolean property here
    this._commonService.isLoading.subscribe((value) => {
      this.isLoading = value;

    })
  }


  onRouteChanged(e: Event) {
    if (!(e instanceof NavigationEnd)) {
      return;
    } else if (!this._localService.get('userToken')) {

      this.isLogin = false;
      // this.router.navigate(['/login'])
    } else {
      this.isLogin = true;

    }
  }


}
