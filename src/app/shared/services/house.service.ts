import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {House} from "../models/house";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  housesUrl: string = "http://localhost:8080/api/houses/"

  // Observable string sources
  private userHousesSource = new Subject<House[]>();
  userHouses$ = this.userHousesSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  saveNewHouse(house: House): Observable<any> {
    // this.httpClient.get<House>(this.housesUrl, );
    return this.httpClient.post<House>(this.housesUrl, house);
  }

  updateHouse(house: House): Observable<any> {
    return this.httpClient.put<House>(this.housesUrl, house);
  }

  getAllHouses(): Observable<any> {
    return this.httpClient.get<House[]>(this.housesUrl);
  }

  updateUserHouses() {
    this.getAllHouses().subscribe( {
      next: houses => {
        this.userHousesSource.next(houses);
      },
      error: err => {
        console.error("There was an error retrieving the user's houses.")
      }
    })
  }

  getHouse(houseId: string): Observable<any> {
    return this.httpClient.get<House>(`${this.housesUrl}/${houseId}`);
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
