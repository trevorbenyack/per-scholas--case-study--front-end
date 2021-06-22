import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, IsActiveMatchOptions} from "@angular/router";
import {HouseListService} from "../../../../shared/services/house-list.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userHousesNames: string[] = [];

  constructor(public router: Router,
              private houseListService: HouseListService) { }

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
  }

  getUserSidebarHouses() {

    this.houseListService.getUserHouses().subscribe({
      next: value => {},
      error: err => {}
    });
    // get house names, areas, from server to display to user
  }



}
