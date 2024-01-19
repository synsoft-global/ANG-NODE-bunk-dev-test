import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { MessageService } from './message.service';
import { CommonService } from '../common/common.service';

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError =
  <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

/** Handles HttpClient errors */
@Injectable()
export class HttpErrorHandlerService {
  constructor(private messageService: MessageService,
    private _commonService: CommonService) { }

  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') =>

    <T>(operation = 'operation', result = {} as T) =>
      this.handleError(serviceName, operation, result);

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   *
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {

    return (error: HttpErrorResponse): Observable<T> => {
      if (error.status === 401 || 400 || 403) {
        this._commonService.logout();
        this._commonService.showSnackbar(error.error.message ? error.error.message : "Something went wrong", false, 1);

      }
      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;
      this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);

      return throwError(error);
    };

  }
}
