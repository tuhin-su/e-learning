import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashbordComponent } from './dashbord.component';
import { ModuleModule } from '../modules/module.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassesComponent } from './classes/classes.component';
const routes: Routes = [
  { path: 'attendance', component: AttendanceComponent },
  { path: 'classes', component: ClassesComponent },
];

@NgModule({
  declarations: [
    DashbordComponent,
    AttendanceComponent,
    ClassesComponent
  ],
  imports: [
    BrowserModule,
    ModuleModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: [DashbordModule],
  exports:[RouterModule]
})
export class DashbordModule { }
