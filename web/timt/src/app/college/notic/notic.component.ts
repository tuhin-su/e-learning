import { Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import {MatCardImage, MatCardModule} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { NoticeCardComponent } from "../../components/notice-card/notice-card.component";



@Component({
  selector: 'app-notic',
  imports: [MatCardModule, MatFabButton, MatDivider, NoticeCardComponent],
  templateUrl: './notic.component.html',
  styleUrl: './notic.component.scss'
})
export class NoticComponent {

  notices:any[]= [
    {
      title:"title",
      description:"description",
      date:"4/5/4",
      host:"host",
    },

    {
      title:"title",
      description:"description",
      date:"4/5/4",
      host:"host",
    },

    {
      title:"title",
      description:"description",
      date:"4/5/4",
      host:"host",
    },

    {
      title:"title",
      description:"description",
      date:"4/5/4",
      host:"host",
    },

  ]
}
