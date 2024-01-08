import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { HttpErrorHandlerService, HandleError } from '../error-handler/http-error-handler.service';
import { HttpHeaders } from '@angular/common/http';
import { Configuration } from '../global/app.constant';
import { CommonService } from '../common/common.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class PayoutsService {
  baseUrl = 'http://localhost:3000';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService,
    private _commonService: CommonService) {
    this.handleError = httpErrorHandler.createHandleError('PayoutsService');
  }
  calculatePayout(data: any, url: String): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/' + url, { expenses: data }, httpOptions).pipe(
      catchError(this.handleError('calculatePayout', { expenses: data }))
    );
  }


  addPaygroup(data: any) {
    this._commonService.isLoading.next(true);
    return this.http.post(Configuration.apiURL + 'group/create', data).pipe(
      catchError(this.handleError('addPaygroup')),
      finalize(() => {
        this._commonService.isLoading.next(false);
        // Set isLoading to false after API call
        setTimeout(() => {
        }, 500)
      })
    );
  }

  getPaygroup() {
    this._commonService.isLoading.next(true);
    return this.http.get(Configuration.apiURL + 'group').pipe(
      catchError(this.handleError('getPaygroup')),
      finalize(() => {
        this._commonService.isLoading.next(false);
        // Set isLoading to false after API call
        setTimeout(() => {
        }, 500)
      })
    );
  }

  getUserByGroup(id: any) {
    this._commonService.isLoading.next(true);
    // return this.http.get(Configuration.apiURL + `group/members/${id}`).pipe(
    return this.http.get(Configuration.apiURL + 'group/members/65955c950720035c05dce3fb').pipe(
      catchError(this.handleError('getUserByGroup')),
      finalize(() => {
        this._commonService.isLoading.next(false);
        setTimeout(() => {

        }, 500)
      })
    );
  }

}
