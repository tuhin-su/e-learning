import { Component, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { capitalizeUserName } from '../../utility/function';
import { MatCardContent } from '@angular/material/card';

@Component({
  selector: 'notic-card',
  imports: [
    MatButton,
    MatCardModule,
    MatCardModule,
    MatDividerModule,
    MatCardContent],
  templateUrl: './notic-card.component.html',
  styleUrl: './notic-card.component.scss'
})
export class NoticCardComponent implements OnInit {
  @Input() notic?: {
    title: string;
    description: string;
    date: string;
    host: string;
    downloadLink: string | null;
    user:{
      name: string;
      group: string;
      image: string | null;
    }
  };
  itNew: boolean = false;
  ngOnInit(): void {
    if (this.notic) {
      this.notic.user.name = capitalizeUserName(this.notic.user.name);
      this.notic.title = capitalizeUserName(this.notic.title);
    }
  }

  calculateNew(){
    if (this.notic?.date){
      const date = new Date(this.notic.date);
      const today = new Date();
      const diffTime = today.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7){
        this.itNew = true;
      }
    }
  }
}
