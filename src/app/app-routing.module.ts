import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./modules/dashboard/dashboard/dashboard.component";
import {ReportsComponent} from "./modules/report/reports/reports.component";
import {HouseInformationComponent} from "./modules/house-information/house-information.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  // {path: 'houses/createNewHouse', component: HouseInformationComponent},
  {path: 'houses/:houseId', component: HouseInformationComponent},
  {path: 'reports', component: ReportsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
