import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandlerService, HandleError } from './http-error-handler.service';
import { HttpHeaders } from '@angular/common/http';
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
    httpErrorHandler: HttpErrorHandlerService) {
    this.handleError = httpErrorHandler.createHandleError('PayoutsService');
  }
  calculatePayout(data: any, url: String): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/' + url, {expenses:data}, httpOptions).pipe(
      catchError(this.handleError('calculatePayout', {expenses:data}))
    );
  }
}
