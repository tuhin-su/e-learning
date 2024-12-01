import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { GlobalStorageService } from '../services/global-storage.service';
import { capitalizeUserName } from '../utility/function';
@Component({
  selector: 'app-dashbord',
  imports: [MatDividerModule,MatCardModule,MatIconModule,MatButtonModule,MatBadgeModule],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.scss'
})
export class DashbordComponent implements OnInit {

  constructor(
    private globalStorageService: GlobalStorageService
  ) { }

  user?: any;
  lable?: string;

  @ViewChild('navImg') navImg!: ElementRef<HTMLImageElement>;

  ngOnInit(): void {
    if (this.globalStorageService.get('info')) {
      this.user = this.globalStorageService.get('info');
      this.lable = this.globalStorageService.get('lable');
      this.user.name = capitalizeUserName(this.user.name);
      
      }
    }
}
