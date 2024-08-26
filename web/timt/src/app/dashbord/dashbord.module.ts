import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashbordComponent } from './dashbord.component';

@NgModule({
  declarations: [
    DashbordComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [DashbordModule]
})
export class DashbordModule { }
