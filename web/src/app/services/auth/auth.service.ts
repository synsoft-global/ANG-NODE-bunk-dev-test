
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from 'src/app/services/global/app.constant';
import { CommonService } from '../common/common.service';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { HandleError, HttpErrorHandlerService } from '../error-handler/http-error-handler.service';
import { LocaldataService } from '../localdata/localdata.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private handleError: HandleError;
  constructor(private http: HttpClient, private _commonService: CommonService,
    private _local: LocaldataService,
    httpErrorHandler: HttpErrorHandlerService) {
    this.handleError = httpErrorHandler.createHandleError('AuthService');
  }

  loggedIn() {
    let token = this._local.get('userToken');
    if (token) {
      return true;
    } else {
      return false
    }
  }


  countryList() {
    return this.http.get(Configuration.apiURL + 'countries').pipe(
      catchError(this.handleError('countryList'))
    )
  }


  category() {
    return this.http.get(Configuration.apiURL + 'category').pipe(
      catchError(this.handleError('category'))
    )
  }

  login(data: any) {
    this._commonService.isLoading.next(true);
    return this.http.post(Configuration.apiURL + 'user/login', data).pipe(
      catchError(this.handleError('login')

      ),
      finalize(() => {
        setTimeout(() => {
          this._commonService.isLoading.next(false);
        }, 500)
      })
    );


  }


  register(data: any) {
    this._commonService.isLoading.next(true);
    return this.http.post(Configuration.apiURL + 'user/signup', data).pipe(
      catchError(this.handleError('register')),
      finalize(() => {
        // Set isLoading to false after API call
        this._commonService.isLoading.next(false);

      })
    )
  }





}  