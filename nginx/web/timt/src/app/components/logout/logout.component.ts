import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private router:Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
    }
    if (localStorage.getItem('PInfo')) {
      localStorage.removeItem('PInfo')
    }
  }
  
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
