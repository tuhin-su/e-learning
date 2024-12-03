import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStorageService } from '../../services/global-storage.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private router:Router,
    private storage: GlobalStorageService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
    }
    if (localStorage.getItem('info')) {
      localStorage.removeItem('info')
    }
  }
  
  logout(){
    localStorage.clear();
    this.storage.delete('token')
    this.storage.delete('ifo')
    this.router.navigate(['/welcome']);
  }
}
