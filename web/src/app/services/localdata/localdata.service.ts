import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaldataService {

  constructor() { }


  set(name: string, value: string) {
    localStorage.setItem(name, value);
  }


  get(name: string): any {

    let ret = localStorage.getItem(name);
    switch (ret) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return ret;
    }

  }


  del(name: string) {
    localStorage.removeItem(name);
  }

  remove() {
    localStorage.clear();
  }


  isTokenExpired() {
    var token = this.get("token");
    //return this.jwtHelper.isTokenExpired(token);
  }
}
