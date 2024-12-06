import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'notice-card',
  imports: [MatCardModule,MatDivider],
  templateUrl: './notice-card.component.html',
  styleUrl: './notice-card.component.scss'
})
export class NoticeCardComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  gethostinfo(){

  }

  @Input() notice?:{
    "title": string,
    "description": string,
    "date":string,
    "host":string
  } 

  user?:{
    "image":any | null,
    "name":string,
    "group":string,

  }

}
