import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-token-viwer',
  templateUrl: './token-viwer.component.html',
  styleUrls: ['./token-viwer.component.scss']
})
export class TokenViwerComponent implements OnInit {
  token?:any;
  constructor(private location: Location) { }

  ngOnInit(): void {
    localStorage.getItem('token') ? this.token = localStorage.getItem('token') : this.token = null
  }

  back(){
    this.location.back();
  }
}
