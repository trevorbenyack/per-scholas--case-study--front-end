import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TopbarComponent} from "./layout/components/topbar/topbar.component";
import {SidebarComponent} from "./layout/components/sidebar/sidebar.component";
import {LayoutComponent} from "./layout/layout/layout.component";
import {AppRoutingModule} from "../app-routing.module";


@NgModule({
  declarations: [
    TopbarComponent,
    SidebarComponent,
    LayoutComponent
  ],
  exports: [
    LayoutComponent
  ],
    imports: [
        CommonModule,
        AppRoutingModule
    ]
})
export class CoreModule { }
