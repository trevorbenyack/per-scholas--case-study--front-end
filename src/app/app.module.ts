import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from "./core/core.module";
import { HouseInformationComponent } from './modules/houses/house-information/house-information.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ReportsComponent } from './modules/report/reports/reports.component';
import { ImagePickerComponent } from './shared/components/image-picker/image-picker.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators"


@NgModule({
  declarations: [
    AppComponent,
    HouseInformationComponent,
    DashboardComponent,
    ReportsComponent,
    ImagePickerComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        GooglePlaceModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        RxReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
