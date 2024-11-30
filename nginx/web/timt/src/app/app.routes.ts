import { Routes } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {path: "", component: DashbordComponent,  canActivate: [AuthGuard]},
    {path: "welcome", component: WelcomeComponent},
    {path: "login", component: LoginComponent},
    {path: "me_data", component: ProfileComponent,  canActivate: [AuthGuard]},
];
