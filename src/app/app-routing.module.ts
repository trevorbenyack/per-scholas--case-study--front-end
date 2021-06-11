import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./modules/dashboard/dashboard/dashboard.component";
import {CreateNewHouseComponent} from "./modules/houses/create-new-house/create-new-house.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'houses/createNewHouse', component: CreateNewHouseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
