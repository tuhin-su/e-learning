import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MeDataComponent } from './me-data/me-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCardComponent } from './app-card/app-card.component';
import { PostCardComponent } from './post-card/post-card.component';

@NgModule({
  declarations: [
    MeDataComponent,
    AppCardComponent,
    PostCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [],
  exports: [AppCardComponent, PostCardComponent]
})
export class ModuleModule { }
