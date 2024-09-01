import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { MeDataComponent } from './modules/me-data/me-data.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'me_data', component: MeDataComponent , canActivate: [AuthGuardService]},
  { path: 'dash', component: DashbordComponent, canActivate: [AuthGuardService] },
  { path: '', component: DashbordComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // Catch-all route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
