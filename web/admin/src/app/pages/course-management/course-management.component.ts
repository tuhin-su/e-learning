
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
import { TagModule } from 'primeng/tag';
import { Customer, CustomerService, Representative } from '../service/customer.service';
import { Product, ProductService } from '../service/product.service';
import { ManagementService } from '../../services/management.service';
import { firstValueFrom, tap } from 'rxjs';




@Component({
  selector: 'app-coursemanagement',
  imports: [
    TableModule,
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


    editCourse(course: any) {
        console.log(course);
    }

    deleteCourse(course: any) {
        console.log(course);
    }


}
