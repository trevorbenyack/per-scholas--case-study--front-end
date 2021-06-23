import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, IsActiveMatchOptions} from "@angular/router";
import {HouseService} from "../../../../shared/services/house.service";
import {House} from "../../../../shared/models/house";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userHouses: House[] = [];

  constructor(public router: Router,
              private houseService: HouseService) { }

  // used for adding "active" class to parent of a currently active child nav item
  // used in the "[class.active]="router.isActive('/houses', isActiveMatchOptions)" tag
  // returns true if the urlTree contains a subtree of the active route
  isActiveMatchOptions: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored'
  }

  ngOnInit(): void {

    this.getUserSidebarHouses();

  }

  getUserSidebarHouses() {

    this.houseService.getAllHouses().subscribe({
      next: value => {
        console.debug("User's houses were successfully retrieved.")
        this.userHouses = value;
        console.debug("User's houses are: ");
        this.userHouses.forEach(h => console.debug(h))
      },
      error: err => {
        alert("There was an error retrieving the user's houses.")
      }
    });
  }

  isActive(instruction: any[]): boolean {
    // Set the second parameter to true if you want to require an exact match.
    return this.router.isActive(this.router.createUrlTree(instruction), this.isActiveMatchOptions);
  }




}
