import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { UserService } from '../../services/user.service';
import { firstValueFrom, tap } from 'rxjs';


@Component({
  selector: 'notice-card',
  imports: [MatCardModule,MatDivider],
  templateUrl: './notice-card.component.html',
  styleUrl: './notice-card.component.scss'
})
export class NoticeCardComponent implements OnInit {
  
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

  constructor (private userSivice: UserService) {}
  ngOnInit(): void {
    this.gethostinfo();
  }

  async gethostinfo(){
    if(this.notice){
      if(this.notice.host){
        await firstValueFrom(this.userSivice.getUserinfo(this.notice.host).pipe(
          tap(
            (response)=>{
              console.log(response);
            },
            (error)=>{
              console.log(error);
            }
          )
        ))
        
      }
    }
  }

}
