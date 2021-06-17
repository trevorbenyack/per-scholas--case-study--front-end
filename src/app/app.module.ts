import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from "./core/core.module";
import { CreateNewHouseComponent } from './modules/houses/create-new-house/create-new-house.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ReportsComponent } from './modules/report/reports/reports.component';
import { ImagePickerComponent } from './shared/components/image-picker/image-picker.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    CreateNewHouseComponent,
    DashboardComponent,
    ReportsComponent,
    ImagePickerComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        GooglePlaceModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
