import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStorageService } from '../../services/global-storage.service';
import { UserService } from '../../services/user.service';
import { LoadingService } from '../../services/loading-service.service';
import { firstValueFrom, tap } from 'rxjs';
@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private router:Router,
    private storage: GlobalStorageService,
    private userService: UserService,
    private loding : LoadingService

  ) { }

  async ngOnInit() {
    this.loding.showLoading();
    await firstValueFrom(this.userService.logout().pipe(
      tap(
        (res) => {
          this.loding.hideLoading();
          this.logout();
        },
        (error) => {
          this.loding.hideLoading();
          this.logout();
        }
      )
    ));
    this.loding.hideLoading();
  }
  
  async logout(){
    localStorage.clear();
    this.storage.delete('token')
    this.storage.delete('ifo')
    this.router.navigate(['/welcome']);
  }
}
