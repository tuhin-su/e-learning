import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent implements OnInit {
  show: Number = 0;
  user: any = localStorage.getItem('info');

  @ViewChild('navImg') navImg!: ElementRef<HTMLImageElement>;

  constructor(private router:Router) { }

  detectType() {
    switch (localStorage.getItem('group')) {
      case 'SU':
        this.show = 0;
        break;
      case 'ST':
        this.show = 1;
        break;
      default:
        this.show = 0;
        break;
    }
  }

  ngOnInit(): void {
    this.detectType();
    if (this.user) {
      this.user = JSON.parse(this.user);
    }
    // Use a timeout to ensure the element is rendered
    setTimeout(() => {
      if (this.user?.img && this.navImg) {
        this.navImg.nativeElement.src = this.user.img;
      }
    }, 0);
    console.log(this.user);
  }
  setting(){
    this.router.navigate(['setting'])
  }
  notify(){
    this.router.navigate(['notify'])

  }
}
