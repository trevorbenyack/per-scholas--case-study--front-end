import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {House} from "../models/house";
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HouseListService {

  housesUrl: string = "http://localhost:8080/api/houses/"

  constructor(private httpClient: HttpClient) {
  }

  getUserHouses(): Observable<any> {
    return this.httpClient.get<HousesResponse>(this.housesUrl).pipe(map(response => {
      response._embedded.houses
    }))
  }
}

interface HousesResponse {
  "_embedded": {
    "houses": House[],
    "_links": {
      "self": {
        "href": string
      },
      "profile": {
        "href": string
      }
    },
    "page": {
      "size": number,
      "totalElements": number,
      "totalPages": number,
      "number": number
    }
  }
}
