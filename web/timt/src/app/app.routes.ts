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
import { SecurtyComponent } from './college/securty/securty.component';
import { NoticComponent } from './college/notic/notic.component';
import { ChangePasswordComponent } from './college/chpw/change-password/change-password.component';
import { AccessComponent } from './college/access/access.component';

export const routes: Routes = [
    {path: "", component: DashbordComponent,  canActivate: [AuthGuard]},
    {path: "welcome", component: WelcomeComponent},
    {path: "login", component: LoginComponent},
    {path: "me_data", component: ProfileComponent,  canActivate: [AuthGuard]},
    {path: "college/attendance", component: AttendanceComponent,  canActivate: [AuthGuard]},
    {path: "college/class", component: ClassesComponent,  canActivate: [AuthGuard]},
    {path: "college/feedback", component: FeedbackComponent,  canActivate: [AuthGuard]},
    {path: "user/security", component: SecurtyComponent,  canActivate: [AuthGuard]},
    {path: "college/notic", component: NoticComponent,  canActivate: [AuthGuard]},
    {path: "logout", component: LogoutComponent,  canActivate: [AuthGuard]},
    {path: "access", component: AccessComponent,  canActivate: [AuthGuard]},
    {path: "chpw", component: ChangePasswordComponent},
    {path: "**", component: DashbordComponent,  canActivate: [AuthGuard]},
];
