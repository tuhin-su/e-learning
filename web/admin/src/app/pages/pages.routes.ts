import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { DbaComponent } from './dba/dba.component';
import { MgroupComponent } from './dashboard/components/mgroup/mgroup.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'dba', component: DbaComponent },
    { path: 'groups', component: MgroupComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
