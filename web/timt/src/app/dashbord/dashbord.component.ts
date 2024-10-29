import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent implements OnInit {
  user: any = localStorage.getItem('info');
  lable: any = localStorage.getItem('lable')
  storedLocation: { lat: number; lng: number } = { lat: 0, lng: 0 }; // Store the location to compare

  @ViewChild('navImg') navImg!: ElementRef<HTMLImageElement>;

  constructor(
    private router:Router
  ) {}

  ngOnInit(): void {
    if (this.user) {
      this.user = JSON.parse(this.user);
    }
    setTimeout(() => {
      if (this.user?.img && this.navImg) {
        this.navImg.nativeElement.src = this.user.img;
      }
    }, 0);
  }

  setting(){
    this.router.navigate(['setting'])
  }

  notify(){
    this.router.navigate(['notify'])
  }

}
