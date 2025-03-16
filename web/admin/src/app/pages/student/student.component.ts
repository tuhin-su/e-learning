
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
import { FormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagementService } from '../../services/management.service';
import { firstValueFrom, tap } from 'rxjs';
import { AlertService } from '../../services/alert.service';



@Component({
  selector: 'app-student',
  imports: [
    TableModule,
    ReactiveFormsModule,
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
    
   templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
  providers: [ConfirmationService, MessageService,ManagementService]
})
export class  StudentComponent implements OnInit {

  students: any[] = [];
  loading: boolean = true;
  display: boolean = false;  // Controls dialog visibility
  isEditing: boolean = false;
  studentForm:FormGroup = new FormGroup({});

    constructor(
       private management : ManagementService,
       private fb : FormBuilder,
       private alert: AlertService
    ) {
      this.studentForm = this.fb.group({
        id:[''],
        name: ['', Validators.required],
        description:['', Validators.required],
        course_fees: ['', Validators.required],
        course_duration: ['', Validators.required],
      });
    }

    ngOnInit() {
       this.fetchStudent();
    }


    fetchStudent(){
        firstValueFrom(this.management.getStudentInfo().pipe(
            tap(
                (response) => {
                    if(response){
                        this.loading = false
                        console.log(response);
                        this.students = response;
                    }
                }
                   
            )
        )
    )
    }

    openEditDialog(student: any, isEditing: boolean = false): void {
        this.isEditing = isEditing;
        this.studentForm.patchValue({
          id: student.id,
          name: student.name,
          description: student.description,
          course_fees: student.course_fees,
          course_duration: student.course_duration,
        });
        this.display = true;  // Show the dialog
      }
    
      async saveCourse() {
       if(this.isEditing){
        await firstValueFrom(this.management.editCourse(this.studentForm.value).pipe(
            tap(
                (response) => {
                    if(response){
                        this.alert.showSuccessAlert(response.message);
                        this.display = false;
                        this.fetchStudent();
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ));
        return;
       }

       if(this.studentForm.valid){
        await firstValueFrom(this.management.creteCourse(this.studentForm.value).pipe(
          tap(
            (response) => {
              if(response){
                this.alert.showSuccessAlert(response.message);
                this.display = false;
                this.fetchStudent();
              }
            },
            (error) => {
              this.alert.showErrorAlert(error.error.message);
            }
          )
        ))
       }
        
        this.display = false;
      }
    

    async deleteCourse(course: any) {
        await firstValueFrom(this.management.deleteCourse(course.id).pipe(
            tap(
                (response) => {
                    if(response){
                        this.alert.showSuccessAlert(response.message);
                        this.fetchStudent();
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ))
    }


}
