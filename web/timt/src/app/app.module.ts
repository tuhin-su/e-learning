import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingInterceptor } from 'src/service/loading/loading.interceptor';
import { LoadingComponent } from 'src/app/loading/loading.component';
import { AlertComponent } from './alert/alert.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashbordModule } from './dashbord/dashbord.module';
import { ModuleModule } from './modules/module.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    LoadingComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DashbordModule,
    ModuleModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
