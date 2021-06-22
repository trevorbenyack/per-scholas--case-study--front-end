import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Area} from "../models/area";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  areasUrl: string = "http://localhost:8080/api/areas/";

  constructor(private httpClient: HttpClient) { }

  saveAreaToServer(area: Area): Observable<any>{
    return this.httpClient.post<AreaResponse>(this.areasUrl, area);
  }

  // saveAreaToHouse(putAreaToHouseUrl: string, areaResourceUrl: string): Observable<any> {
  //
  //   console.debug("inside saveAreaToHouse()")
  //   console.debug("putAreaToHouseUrl is: " + putAreaToHouseUrl);
  //   console.debug("areaResourceUrl is: " + areaResourceUrl);
  //
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'text/uri-list'
  //     })
  //   };
  //   return this.httpClient.put<Area>(putAreaToHouseUrl, areaResourceUrl, httpOptions);
  // }
}

interface AreaResponse {
  areaId: string;
  areaName: string;
  _links: {
    self: {
      href: string
    },
    area: {
      href: string
    },
    house: {
      href: string
    }
  }
}
