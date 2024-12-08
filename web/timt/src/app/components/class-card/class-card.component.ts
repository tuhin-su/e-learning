import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { capitalizeUserName, debug } from '../../utility/function';
import { MatDivider } from '@angular/material/divider';
import { UserService } from '../../services/user.service';
import { first, firstValueFrom, tap } from 'rxjs';
import { FunctionaltyService } from '../../services/functionalty.service';
import { extractHttpsLinks } from '../../utility/function';
@Component({
  selector: 'class-card',
  imports: [MatCardModule, MatButtonModule,MatDivider],
  providers: [provideNativeDateAdapter()],
  templateUrl: './class-card.component.html',
  styleUrl: './class-card.component.scss'
})
export class ClassCardComponent implements OnInit, OnChanges {
  @Input() card?: {
    "content_id": number | null,
    "createDate": string,
    "description": string,
    "host": string,
    "id": number,
    "semester": number,
    "stream": number,
    "title": number,
  }

  downloadLink?: string | null

  user?:{
    address: string,
    birth: string,
    gender: string,
    img: string,
    name: string,
    phone: string,
    user_id: string
} | any;

  videLink?: string;

  contentInformation?: {
    "id": number,
    "content": string,
    "content_name": string,
    "content_size": number,
    "content_type": string,
    "createBy": string,
    "createDate": string
  };
  contentDownloadLink?: boolean

  constructor (
    private service: UserService,
    private postService: FunctionaltyService
  ) { }

  ngOnInit(): void {
    if (this.card?.host) {
      this.hostInfo(this.card.host);
    }
    if (this.card?.description) {
      this.videLink = extractHttpsLinks(this.card.description)[0];
    }

    if (this.card?.content_id) {
      if (this.contentInformation) {
        if(this.contentInformation.id == this.card.content_id){
          return;
        }
      }
      this.getPost(this.card.content_id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card']) {
      this.ngOnInit();
    }
  }

  async hostInfo(host:string){
    await firstValueFrom(this.service.getUserinfo(host).pipe(
      tap(
        (response)=>{
          if (response) {
            this.user = response
            if (this.user) {
              this.user.name = capitalizeUserName(this.user.name)
            }
            if (this.user.img == '') {
              this.user.img = '/img/user-286-64.png'
            }
          }
        }
      )
    ))
  }

  async getPost(id: number){
    await firstValueFrom(this.postService.getPost(id).pipe(
      tap(
        (response)=>{
          if (response) {
            this.contentInformation = response
            if (this.contentInformation?.content_type == 'text/x-python') {
              this.contentDownloadLink = true
            }
          }
        },
        (error)=>{
          debug(error)
        }
      )
    ))
  }
  onclickDownload(){
    console.log(this.downloadLink)
  }

  downloadContentInformation(){
    if (this.contentInformation) {
      const blob = new Blob([this.contentInformation.content], { type: this.contentInformation.content_type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.contentInformation.content_name;
      link.click();
      URL.revokeObjectURL(url);
    }
  }
}
