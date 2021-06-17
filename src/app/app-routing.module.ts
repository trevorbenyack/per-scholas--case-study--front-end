import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./modules/dashboard/dashboard/dashboard.component";
import {CreateNewHouseComponent} from "./modules/houses/create-new-house/create-new-house.component";
import {ReportsComponent} from "./modules/report/reports/reports.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'houses/createNewHouse', component: CreateNewHouseComponent},
  {path: 'reports', component: ReportsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
