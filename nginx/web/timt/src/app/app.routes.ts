import { Routes } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';
import { AttendanceComponent } from './college/attendance/attendance.component';
import { ClassesComponent } from './college/classes/classes.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { LogoutComponent } from './components/logout/logout.component';

export const routes: Routes = [
    {path: "", component: DashbordComponent,  canActivate: [AuthGuard]},
    {path: "welcome", component: WelcomeComponent},
    {path: "login", component: LoginComponent},
    {path: "me_data", component: ProfileComponent,  canActivate: [AuthGuard]},
    {path: "college/attendance", component: AttendanceComponent,  canActivate: [AuthGuard]},
    {path: "college/class", component: ClassesComponent,  canActivate: [AuthGuard]},
    {path: "college/feedback", component: FeedbackComponent,  canActivate: [AuthGuard]},
    {path: "logout", component: LogoutComponent,  canActivate: [AuthGuard]},
];