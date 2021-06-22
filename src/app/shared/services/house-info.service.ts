import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {House} from "../models/house";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HouseInfoService {

  housesUrl: string = "http://localhost:8080/api/houses/"

  constructor(private httpClient: HttpClient) { }

  saveNewHouse(house: House): Observable<any> {
    return this.httpClient.post<House>(this.housesUrl, house);
  }
}

interface HouseInfoResponse {
  "houseId": string,
  "houseName": string,
  "streetAddress01": string,
  "streetAddress02": string,
  "city": string,
  "state": string,
  "zipCode": string,
  "notes": string,
  "pictureUrl": string,
  "_links": {
    "self": {
      "href": string
    },
    "house": {
      "href": string
    },
    "users": {
      "href": string
    }
  }
}
