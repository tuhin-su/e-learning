
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
import { DropdownModule } from 'primeng/dropdown';



@Component({
  selector: 'app-user',
  imports: [
    TableModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
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
    
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [ConfirmationService, MessageService,ManagementService]
})
export class  UserComponent implements OnInit {

  students: any[] = [];
  loading: boolean = true;
  display: boolean = false;  // Controls dialog visibility
  isEditing: boolean = false;
  studentForm:FormGroup = new FormGroup({});
  loadingService: any;
  stream?:{ lable: String, value: Number }[] = [];
  selectedstream: any;

    constructor(
       private management : ManagementService,
       private fb : FormBuilder,
       private alert: AlertService
    ) {
      this.studentForm = this.fb.group({
        id:[''],
        roll: ['', Validators.required],
        reg: ['', Validators.required],
        course_id: ['', Validators.required],
        semester: ['', Validators.required],
        status: ['', [Validators.required, Validators.min(0)]],
      });
      
    }

    ngOnInit() {
      this.getCourses(),
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
          id:student.id,
          roll: student.roll,
          reg : student.reg,
          course_id : student.course_id,
          course_name: student.course_name,
          semester: student.semester,
          status: student.status,
        });
        this.display = true;  // Show the dialog
        this.getCourses();
      }

      selectCourse(event: any){
        this.studentForm.patchValue({
          "course_id" : event.value,
         
        })
        console.log(event);
       
      }

      async getCourses(){
        await firstValueFrom(this.management.getStreamInfo().pipe(
          tap(
            (res)=>{
              if(res){
                   this.stream = res
              }
            }
          )
        ));
      }

     
      async saveStudent() {
       if(this.isEditing){
        await firstValueFrom(this.management.editStudent(this.studentForm.value).pipe(
            tap(
                (response) => {
                    if(response){
                        this.alert.showSuccessAlert(response.message);
                        this.display =false;
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

      //  if(this.studentForm.valid){
      //   await firstValueFrom(this.management.creteCourse(this.studentForm.value).pipe(
      //     tap(
      //       (response) => {
      //         if(response){
      //           this.alert.showSuccessAlert(response.message);
      //           this.display = false;
      //           this.fetchStudent();
      //         }
      //       },
      //       (error) => {
      //         this.alert.showErrorAlert(error.error.message);
      //       }
      //     )
      //   ))
      //  }
        
        this.display = false;
      }
    

    async deleteStudent(student: any) {
        await firstValueFrom(this.management.deleteStudent(student.id).pipe(
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
