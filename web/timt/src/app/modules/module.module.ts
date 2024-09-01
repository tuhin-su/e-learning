import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MeDataComponent } from './me-data/me-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCardComponent } from './app-card/app-card.component';

@NgModule({
  declarations: [
    MeDataComponent,
    AppCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [],
  exports: [AppCardComponent]
})
export class ModuleModule { }
