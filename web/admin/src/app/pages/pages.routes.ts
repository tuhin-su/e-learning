import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { DbaComponent } from './dba/dba.component';
import { LogoutComponent } from './auth/logout';
import { DatabaseComponent } from './database/database.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { StudentComponent } from './student/student.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';
import { AttendenceComponent } from './attendence/attendence.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'dba', component: DbaComponent },
    {path: 'logout', component:LogoutComponent},
    {path: 'database', component:DatabaseComponent},
    {path: 'course', component:CourseManagementComponent},
    {path: 'student', component:StudentComponent},
    {path: 'user', component:UserComponent},
    {path: 'group', component:GroupComponent},
    {path: 'attendence', component:AttendenceComponent},
    { path: '**', redirectTo: '/notfound' }
] as Routes;

