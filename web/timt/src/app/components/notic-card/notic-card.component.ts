import { Component, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {MatCardImage, MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { capitalizeUserName } from '../../utility/function';
import { MatCardContent } from '@angular/material/card';

@Component({
  selector: 'notic-card',
  imports: [MatCardImage, MatButton, MatIcon, MatCardModule, MatCardModule,MatDividerModule, MatCardContent],
  templateUrl: './notic-card.component.html',
  styleUrl: './notic-card.component.scss'
})
export class NoticCardComponent implements OnInit {
  @Input() notic?: {
    title: string;
    description: string;
    date: string;
    downloadLink: string | null;
    user:{
      name: string;
      group: string;
      image: string | null;
    }
  };
  ngOnInit(): void {
    if (this.notic) {
      this.notic.user.name = capitalizeUserName(this.notic.user.name);
      this.notic.title = capitalizeUserName(this.notic.title);
    }
  }
}
