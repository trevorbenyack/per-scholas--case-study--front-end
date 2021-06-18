import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient) {
  }

  pushFileToStorage(file: File, url: string): Observable<any> {

    // create FormData object to package image to send to server
    const data: FormData = new FormData();
    data.append('file', file);

    console.log("attempting to upload image");

    return this.httpClient.post<UploadFileResponse>(url, data).pipe(catchError(this.handleError));

  } // end pushFileToStorage()

  handleError(error: HttpErrorResponse) {
    // A client-side or network error occurred. Handle it accordingly.
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);

      if (error.status == 403) {
        throw new Error("You are not permitted to make changes on this account");
      } // end if(403)

      throw new Error("Unexpected error - please try again later");
    } // end else

    // return an observable with a user-facing error message
    return throwError("Unexpected error - please try again later");
  };
} // end FileUploadService

// Intended server response object
interface UploadFileResponse {
  fileName: string,
  fileDownloadUri: string,
  fileType: string,
  size: number
}
