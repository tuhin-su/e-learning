import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as AOS from 'aos';
import { LoadingService } from './services/loading-service.service';

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
    LoadingComponent,
    MatProgressBarModule
  ],
})
export class AppComponent implements OnInit {
  title = 'timt';
  isLoading: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to the loading observable
    this.loadingService.loading$.subscribe((loadingState) => {
      if (this.isLoading !== loadingState) {
        this.isLoading = loadingState;
        this.cdRef.detectChanges(); // Manually trigger change detection
      }
    });

    // Initialize AOS for animations
    AOS.init({
      duration: 1000, // Customize the duration or other options
      easing: 'ease-in-out', // Customize easing
      once: true, // Only animate once
    });
  }
}
