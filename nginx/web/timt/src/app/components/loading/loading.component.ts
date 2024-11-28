import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading-service.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule],  // Include CommonModule here
  template: `
    <mat-progress-bar
      *ngIf="isLoading | async"
      mode="indeterminate"
      color="primary"
    ></mat-progress-bar>
  `,
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  isLoading: any;  // Declare the property first

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.isLoading = this.loadingService.loading$;  // Initialize after constructor
  }
}
