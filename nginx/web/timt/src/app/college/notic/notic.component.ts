import { Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import {MatCardImage, MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';



@Component({
  selector: 'app-notic',
  imports: [MatCardModule,MatFabButton],
  templateUrl: './notic.component.html',
  styleUrl: './notic.component.scss'
})
export class NoticComponent {

}
