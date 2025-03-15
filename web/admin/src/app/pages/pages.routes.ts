import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { DbaComponent } from './dba/dba.component';
import { LogoutComponent } from './auth/logout';
import { DatabaseComponent } from './database/database.component';
import { CourseManagementComponent } from './course-management/course-management.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'dba', component: DbaComponent },
    {path: 'logout', component:LogoutComponent},
    {path: 'database', component:DatabaseComponent},
    {path: 'course', component:CourseManagementComponent},
    { path: '**', redirectTo: '/notfound' }
] as Routes;

