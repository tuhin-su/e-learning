
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
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DropdownModule } from 'primeng/dropdown';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-student',
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
    
   templateUrl: './student.component.html',
   styleUrl: './student.component.scss',
   providers: [ConfirmationService, MessageService,ManagementService]
})
export class  StudentComponent implements OnInit {

  students: any[] = [];
  page: number = 0;  // Start with the first page
  size: number = 15; // Default size (15 records per page)
  loading: boolean = true;
  display: boolean = false;  // Controls dialog visibility
  displayStudentDialog : boolean = false;
  isEditing: boolean = false;
  studentForm:FormGroup = new FormGroup({});
  semesterForm:FormGroup = new FormGroup({});
  loadingService: any;
  stream?:{ lable: String, value: Number }[] = [];
  selectedstream: any;
  itemCount = 0;
  totalRecords: any[]=[];

  semesterOptions = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' }
  ]

 


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


      this.semesterForm = this.fb.group({
        from_semester: ['', Validators.required],
        semester: ['',Validators.required],
      });
      
    }

    ngOnInit() {
      this.getCourses(),
      this.fetchStudent()
    }




    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }



  exportToExcel(): void {

    const filteredStudents = this.students.map(student => ({
      'Student Name': student.student_name,
      'Roll Number': student.roll,
      'Course': student.course_name,
      'Semester': student.semester,
      'Phone number': student.student_phone
    }));
  const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  saveAs(blob, 'students.xlsx');
}




    fetchStudent(){
      this.loading = true;
      const payload = {
        current: this.students.length,
        max: this.size
      };
        firstValueFrom(this.management.getStudentInfo(payload).pipe(
            tap(
                (response) => {
                    if(response){
                        this.loading = false
                        this.students.concat(response)
                        this.students = [...this.students, ...response];
                        this.totalRecords = response.totalRecords;
                        // console.log(response);
                        // this.students = response;
                    }
                }),
                catchError((error) => {
                  console.error("Error in fetching user data:", error);
                  this.loading = false;
                  return of({ students: [], totalRecords: 0 });
                })
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
        // console.log(event);
       
      }


      openSemDialogbox(student: any): void {
        this.semesterForm.patchValue({
          from_semester: student.from_semester,
          semester: student.semester,
  
        });
        this.displayStudentDialog = true;  // Show the dialog
       
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
        
        this.display = false;
      }
    


     
      async saveSemester() {
         await firstValueFrom(this.management.migrateStudent(this.semesterForm.value).pipe(
             tap(
                 (response) => {
                     if(response){
                         this.alert.showSuccessAlert(response.message);
                         this.displayStudentDialog =false;
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



    onScroll(event: any) {
      const {
        first,
        rows
      } = event;

      const totalScrolled = first + rows;

      if(this.students){
        if (totalScrolled >= this.students.length) {
          console.log("📦 Reached end of scroll!");
          this.fetchStudent()
        }
      }
    }

    onLazyLoad(event: any) {
        this.loading = true;
        setTimeout(() => {
          this.fetchStudent();
          this.loading = false;
        }, 1000);
      }
    

}
