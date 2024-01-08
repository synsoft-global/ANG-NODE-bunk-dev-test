import { Component } from '@angular/core';
import { LocaldataService } from '../services/localdata/localdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  name: string = '';
  constructor(private _localService: LocaldataService,
    private router: Router) {

  }

  ngOnInit() {
    let data = this._localService.get('userData');
    data = JSON.parse(data);
    this.name = data.userName

  }



  logout() {
    this._localService.del('userToken');
    this.router.navigate(['/login']);
  }
}
