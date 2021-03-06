import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from "./core/core.module";
import { HouseInformationComponent } from './modules/house-information/house-information.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ReportsComponent } from './modules/report/reports/reports.component';
import { ImagePickerComponent } from './shared/components/image-picker/image-picker.component';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AreasDirective } from './shared/Directives/areas.directive';

@NgModule({
  declarations: [
    AppComponent,
    HouseInformationComponent,
    DashboardComponent,
    ReportsComponent,
    ImagePickerComponent,
    AreasDirective,
  ],
    imports: [
      BrowserModule,
      CoreModule,
      GooglePlaceModule,
      ReactiveFormsModule,
      HttpClientModule,
      FormsModule,
      RxReactiveFormsModule,
      BrowserAnimationsModule,
      AppRoutingModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
