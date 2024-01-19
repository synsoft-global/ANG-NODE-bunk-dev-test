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


  invitFriend(data: any) {
    this._commonService.isLoading.next(true);
    return this.http.post(Configuration.apiURL + 'invite', data).pipe(
      catchError(this.handleError('inviteFriend')),
      finalize(() => {
        setTimeout(() => {
          this._commonService.isLoading.next(false);
        }, 500)
      })
    )
  }


  joinGroup(data: any) {
    console.log('data: ', data);
    this._commonService.isLoading.next(true);
    return this.http.post(Configuration.apiURL + `group/join/${data.groupId}`, data).pipe(
      catchError(this.handleError('joinGroup')),
      finalize(() => {
        setTimeout(() => {
          this._commonService.isLoading.next(false);
        }, 500)
      })
    )
  }


  addPaygroup(data: any) {
    this._commonService.isLoading.next(true);
    return this.http.post(Configuration.apiURL + 'group/create', data).pipe(
      catchError(this.handleError('addPaygroup')),
      finalize(() => {
        this._commonService.isLoading.next(false);
      })
    );
  }


  getPaygroup(data: any) {
    this._commonService.isLoading.next(true);
    return this.http.get(Configuration.apiURL + `group/myGroup?page=${data.page}&limit=${data.limit}`).pipe(
      catchError(this.handleError('getPaygroup')),
      finalize(() => {
        this._commonService.isLoading.next(false);
        setTimeout(() => {
        }, 500)
      })
    );
  }


  getUserByGroup(id: any) {
    this._commonService.isLoading.next(true);
    return this.http.get(Configuration.apiURL + `group/getAllGroupMember/${id}`).pipe(
      catchError(this.handleError('getUserByGroup')),
      finalize(() => {
        this._commonService.isLoading.next(false);
      })
    );
  }


  getGropById(id: any) {
    this._commonService.isLoading.next(true);
    return this.http.get(Configuration.apiURL + `group/getDataByGroupId/${id}`).pipe(
      catchError(this.handleError('getGropById')),
      finalize(() => {
        this._commonService.isLoading.next(false);
      })
    );
  }

  editPayGroup(id: any, data: any,) {
    this._commonService.isLoading.next(true);
    return this.http.put(Configuration.apiURL + `group/editGroup/${id}`, data).pipe(
      catchError(this.handleError('editPayGroup')),
      finalize(() => {
        this._commonService.isLoading.next(false);
      })
    );
  }

  deletePayGroup(id: any) {
    this._commonService.isLoading.next(true);
    return this.http.delete(Configuration.apiURL + `group/remove/${id}`).pipe(
      catchError(this.handleError('deleteExpense')),
      finalize(() => {
        this._commonService.isLoading.next(false);
      })
    );
  }

  ///***************** Expense Api *************************///

  addExpense(data: any) {
    this._commonService.isLoading.next(true);
    return this.http.post(Configuration.apiURL + 'expence/add', data).pipe
      (catchError(this.handleError('addExpense')),
        finalize(() => {
          this._commonService.isLoading.next(false);
        })
      );
  }


  getExpenseByGroup(id: any, data: any) {
    this._commonService.isLoading.next(true);
    return this.http.get(Configuration.apiURL + `expence/getExpenceByGroupId/${id}?page=${data.page}&limit=${data.limit}`).pipe
      (catchError(this.handleError('getExpenseByGroup')),
        finalize(() => {
          this._commonService.isLoading.next(false);
        })
      );
  }

  updateExpense(id: any, data: any) {
    this._commonService.isLoading.next(true);
    return this.http.put(Configuration.apiURL + `expence/updateExpence/${id}`, data).pipe
      (catchError(this.handleError('getExpenseByGroup')),
        finalize(() => {
          this._commonService.isLoading.next(false);
        })
      );
  }


  getExpenseDetail(id: any) {
    this._commonService.isLoading.next(true);
    return this.http.get(Configuration.apiURL + `expence/${id}`).pipe
      (catchError(this.handleError('getExpenseDetail')),
        finalize(() => {
          this._commonService.isLoading.next(false);
        })
      );
  }


  deleteExpense(id: any) {
    this._commonService.isLoading.next(true);
    return this.http.delete(Configuration.apiURL + `expence/delete/${id}`).pipe(
      catchError(this.handleError('deleteExpense')),
      finalize(() => {
        this._commonService.isLoading.next(false);
      })
    );
  }


  getBalance(id: any) {
    this._commonService.isLoading.next(true);
    // return this.http.get(Configuration.apiURL + `expence/getTotalExpensesByGroupId/${id}`).pipe(
    return this.http.get(Configuration.apiURL + `expence/finalExpence/${id}`).pipe(
      catchError(this.handleError('getBalance')),
      finalize(() => {
        this._commonService.isLoading.next(false);
      })
    );
  }
}
