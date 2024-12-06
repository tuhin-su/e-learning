import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  constructor(private router: Router) {}
  showMore: boolean = false;

  goLogin(){
    this.router.navigate(['/login'])
  }
  showHide(){
    if (this.showMore) {
      document.getElementById("more")!.style.display = "none";
      document.getElementById("donts")!.style.display = "block";
      this.showMore = false;
    }else{
      document.getElementById("more")!.style.display = "block";
      document.getElementById("donts")!.style.display = "none";
      this.showMore = true;
    }
  }
}
