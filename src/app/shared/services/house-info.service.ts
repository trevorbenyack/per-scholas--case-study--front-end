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
