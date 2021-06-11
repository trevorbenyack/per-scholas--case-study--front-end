import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import { CreateNewHouseComponent } from './modules/houses/create-new-house/create-new-house.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateNewHouseComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
