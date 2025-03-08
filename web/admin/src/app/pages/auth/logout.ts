import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStorageService } from '../../services/global-storage.service';
import { UserService } from '../../services/user.service';
import { LoadingService } from '../../services/loading.service';
import { firstValueFrom, tap } from 'rxjs';
@Component({
  selector: 'app-logout',
  imports: [],
  template: `<div class="root flex-col">
                <div [@bounceUp] class="w-72 h-72">
                    <img src="/img/verified_7641727.png" class="w-full"/>
                </div>
                <div class="text-center">
                    <h1>Successfully Logout!</h1>
                    <button
                    (click)="logout();"
                    class="w-50 mt-3 select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                  >
                    Login Again
                  </button>
                </div>
            </div>
            `
})
export class LogoutComponent {
  constructor(private router: Router,
    private storage: GlobalStorageService,
    private userService: UserService,
    private loding: LoadingService

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

  async logout() {
    localStorage.clear();
    this.storage.delete('token')
    this.storage.delete('ifo')
    this.router.navigate(['/auth/login']);
  }
}
