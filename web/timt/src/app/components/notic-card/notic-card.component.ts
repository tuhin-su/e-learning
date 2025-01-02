import { Component, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { capitalizeUserName, convertToISODate } from '../../utility/function';
import { MatCardContent } from '@angular/material/card';
import { UserService } from '../../services/user.service';
import { firstValueFrom, tap } from 'rxjs';
import { FunctionaltyService } from '../../services/functionalty.service';
import { downloadContentInformation, convertDate } from '../../utility/function';
import { MatIcon } from '@angular/material/icon';
import { extractHttpsLinks } from '../../utility/function';
import { LoadingService } from '../../services/loading-service.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'notic-card',
  imports: [
    MatButton,
    MatCardModule,
    MatCardModule,
    MatDividerModule,
    MatCardContent,
    MatIcon,
    MatProgressBarModule
  ],
  templateUrl: './notic-card.component.html',
  styleUrl: './notic-card.component.scss'
})
export class NoticCardComponent implements OnInit {
  @Input() notic?: {
    content: string;
    createBy: string;
    createDate: string;
    id: number;
    post_id: null | number;
    title: string;   
  };

  user?:{
    name: string;
    img: string | null;
  }

  downloadLink?: string | null;
  itNew: boolean = false;

  contentInformation?: {
    "id": number,
    "content": string,
    "content_name": string,
    "content_size": number,
    "content_type": string,
    "createBy": string,
    "createDate": string
  };
  contentDownloadLink?: boolean;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private postService: FunctionaltyService,
    private loadingService: LoadingService
  ) { }
  ngOnInit(): void {
    if (this.notic?.createBy) {
      this.getInfoHost();
    }

    if (this.notic?.post_id) {
      this.getPostData();
    }

    if (this.notic?.createDate) {
      this.notic.createDate = convertDate(this.notic.createDate);
    }

    if (this.notic) {
      this.notic.title = capitalizeUserName(this.notic.title);
    }
    if (this.notic?.content) {
      this.downloadLink = extractHttpsLinks(this.notic.content)[0];
    }
  }

  calculateNew(){
    if (this.notic?.createDate){
      const date = new Date(this.notic.createDate);
      const today = new Date();
      const diffTime = today.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7){
        this.itNew = true;
      }
    }
  }



  async getInfoHost(){
    this.loadingService.showLoading();
    if (this.notic?.createBy){
      await firstValueFrom(this.userService.getUserinfo(this.notic.createBy).pipe(
        tap(
          (response)=>{
            if (response) {
              this.user = response

              if (this.user && this.user.img == '') {
                this.user.img = '/img/user-286-64.png'
              }

              if (this.user) {
                this.user.name = capitalizeUserName(this.user.name)
              }

            }
          }
        )
      ));
      if (!this.notic.post_id) {
        this.loading = false
      }
    }
    this.loadingService.hideLoading();
  }

  async getPostData(){
    if (this.notic?.post_id) {
      this.contentDownloadLink = true
      await firstValueFrom(this.postService.getPost(this.notic.post_id).pipe(
        tap(
          (response)=>{
            if (response) {
              if (response) {
                this.contentInformation = response
                
              }
              this.loading = false
            }
          }
        )
      ))
      
    }
  }

  downloadContentInformation(){
    if (this.notic?.post_id) {
      let id = btoa(JSON.stringify({
        "id": this.notic.post_id,
        "createBy": this.notic.createBy
      }));
      downloadContentInformation(id);

    }
  }
}
