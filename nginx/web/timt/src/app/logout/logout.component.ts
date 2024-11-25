import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  animations: [
    trigger('bounceUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LogoutComponent implements OnInit {

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
