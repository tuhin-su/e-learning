import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashbordComponent } from './dashbord.component';
import { StudentComponent } from './student/student.component';
import { AdminComponent } from './admin/admin.component';
import { ModuleModule } from '../modules/module.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
  { path: 'attendance', component: AttendanceComponent },
];

@NgModule({
  declarations: [
    DashbordComponent,
    StudentComponent,
    AdminComponent,
    AttendanceComponent
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
