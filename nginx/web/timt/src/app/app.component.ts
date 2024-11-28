import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    LoadingComponent
  ],

})

export class AppComponent implements OnInit {
  title = 'timt';
  ngOnInit(): void {
    // Initialize AOS
    AOS.init({
      duration: 1000, // Customize the duration or other options
      easing: 'ease-in-out', // Customize easing
      once: true, // Only animate once
    });
  }
}
