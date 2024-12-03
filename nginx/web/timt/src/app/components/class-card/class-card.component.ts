import { Component, Input, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { capitalizeUserName } from '../../utility/function';

@Component({
  selector: 'class-card',
  imports: [MatCardModule, MatButtonModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './class-card.component.html',
  styleUrl: './class-card.component.scss'
})
export class ClassCardComponent implements OnInit {
  @Input() card?: {
    title: string,
    description: string | null,
    downloadLink: string | null,
    user?:{
      name: string,
      image: string | null
    },
    blob?: any | null
  }


  ngOnInit(): void {
    if (this.card?.user?.name) {
      this.card.user.name = capitalizeUserName(this.card.user.name)
    }
  }

  onclickDownload(){
    console.log(this.card?.downloadLink)
  }
}
