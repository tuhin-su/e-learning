import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card',
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.scss']
})
export class AppCardComponent implements OnInit {
  @Input() img: any;
  @Input() title?:String;
  @Input() subTitle?:String;
  @Input() link?: string;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  clickBtn(){
    if (this.link) {
      this.router.navigate([this.link])
    }
  }
}
