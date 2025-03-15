
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Customer, CustomerService, Representative } from '../service/customer.service';
import { Product, ProductService } from '../service/product.service';
import { ManagementService } from '../../services/management.service';
import { firstValueFrom, tap } from 'rxjs';




@Component({
  selector: 'app-coursemanagement',
  imports: [
    TableModule,
    DialogModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule],
    
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.scss',
  providers: [ConfirmationService, MessageService,ManagementService]
})
export class CourseManagementComponent implements OnInit {

  courses: any[] = [];
  loading: boolean = true;
  display: boolean = false;  // Controls dialog visibility
  course: any = {};  // Holds the data of the course being edited
  

    constructor(
       private management : ManagementService,
    ) {}

    ngOnInit() {
       

       this.fetchcourses();
    }


    fetchcourses(){
        firstValueFrom(this.management.getStreamInfo().pipe(
            tap(
                (response) => {
                    if(response){
                        this.loading = false
                        console.log(response);
                        this.courses = response;
                    }
                }
                   
            )
        )
    )
    }

    openEditDialog(course: any): void {
        this.course = { ...course };  // Clone the course data to edit it
        this.display = true;  // Show the dialog
      }
    
      saveCourse(): void {
        // Logic to save the course (e.g., send it to the backend)
        console.log('Course saved:', this.course);
        this.display = false;  // Close the dialog
      }
    

    deleteCourse(course: any) {
        console.log(course);
    }


}
