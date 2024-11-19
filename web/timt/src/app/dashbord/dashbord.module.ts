import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashbordComponent } from './dashbord.component';
import { ModuleModule } from '../modules/module.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassesComponent } from './classes/classes.component';
import { NoticBordComponent } from './notic-bord/notic-bord.component';

const routes: Routes = [
  { path: 'attendance', component: AttendanceComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'notic_bord', component: NoticBordComponent },
];

@NgModule({
  declarations: [
    DashbordComponent,
    AttendanceComponent,
    ClassesComponent,
    NoticBordComponent
  ],

  imports: [
    BrowserModule,
    ModuleModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  
  providers: [],
  bootstrap: [DashbordModule],
  exports:[RouterModule]
})
export class DashbordModule { }
