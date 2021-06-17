import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private handler: HttpHandler) { }

  pushFileToStorage(file: File, url: string): Observable<HttpEvent<{}>> {
    const data: FormData = new FormData();
    data.append('file', file);

    const newRequest = new HttpRequest('POST', url, data);

    // .handle(newRequest) is the method that sends the request
    return this.handler.handle(newRequest).pipe(catchError(FileUploadService.handleError));
  }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);

      if (error.status == 403) {
        throw new Error("You are not permitted to make changes on this account");
      }

      throw new Error("Unexpected error - please try again later");
    }

    // return an observable with a user-facing error message
    return throwError("Unexpected error - please try again later");
  };


}
