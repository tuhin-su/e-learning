import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, tap } from 'rxjs';
import { FunctionaltyService } from '../../services/functionalty.service';
import { CollegeService } from '../../services/college.service';
import { AlertService } from '../../services/alert.service';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { debug } from '../../utility/function';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { ClassCardComponent } from '../../components/class-card/class-card.component';
@Component({
  selector: 'app-classes',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    ClassCardComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
  
})
export class ClassesComponent {
  allClassesView:boolean = false;
  createClassView: boolean = false;
  selectedFile: File | null = null;              // Holds the selected file
  uploadId?: number; 
  progress?:{value: number};
  semester?:any;
  stream?:any;

  // userInfo
  label :string | null = localStorage.getItem('lable');
  
  // class from
  calssForm?: FormGroup;

  cardData = {
    title: 'Demo Card',
    description: 'lorom32',
    downloadLink: 'sda',
    user: {
      name: 'student',
      image: ''
    }
  }
  
  constructor(
    private postService: FunctionaltyService,
    private fb: FormBuilder,
    private service: CollegeService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.init();
    this.fetchClasses();
  }
  init(){
    this.semester = [
      { lable: "First sem", value: 1 },
      { lable: "Second sem",  value: 2 },
      { lable: "Third sem", value: 3 },
      { lable: "Fourth sem", value: 4 },
      { lable: "Fifth sem", value:5 },
      { lable: "six sem", value: 6},
      { lable: "Seven sem", value: 7},
      { lable: "Eight sem", value: 8 },
      
    ]


    this.stream = [
      { lable: "BCA", value: 3 },
      { lable: "BBA",  value: 1 },
      { lable: "BHM", value: 2 },
      { lable: "MSC", value: 4 },
      
    ]
  }
  async fetchClasses(){
    await firstValueFrom(this.service.getAll().pipe(
      tap(
        (response)=>{
          if (response) {
            console.log(response)
          }
        },
        (error)=>{
          this.alertService.showWarningAlert(error.error.message);
        }
      )
    ))
  }
  // create class
  createClass(){
    if (this.createClassView) {
      this.createClassView = !this.createClassView;
      if (!this.createClassView) {
        this.fetchClasses();
      }
      return
    }
    this.calssForm = this.fb.group({
      content_id: [''],
      title: ['', Validators.required],
      stream: ['', Validators.required],
      semester: ['', Validators.required],
      description: ['']
    });

    this.createClassView = !this.createClassView;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
      this.uploadFile();
    }
  }

  async uploadFile(){
    if (this.selectedFile) {
      await firstValueFrom(this.postService.postPost(this.selectedFile).pipe(
        tap(
          (response)=>{
            if (response.post_id) {
              this.uploadId = response.post_id;
            }
          },
          (error)=>{
            console.log(error);
            this.alertService.showWarningAlert(error.error.message);
          }
        )
      ))
    }
  }


 async onSubmit(){
  // set content_id
  this.calssForm?.patchValue({content_id: this.uploadId});
  if (this.calssForm?.valid) {
    await firstValueFrom(this.service.addClass(this.calssForm.value).pipe(
      tap(
        (response)=>{
          this.alertService.showSuccessAlert(response.message);
        },
        (error)=>{
          this.alertService.showWarningAlert(error.error.message);
        }
      )
    ))
  }
  else{
    debug(this.calssForm?.value)
    this.alertService.showWarningAlert("Please fill all the fields");
  }
 }

 selectSem(value: any){
  this.calssForm?.patchValue({semester: value});
 }
 selectStream(value: any){
  this.calssForm?.patchValue({stream: value});
 }

 onDateChange(selectedDate: Date): void {
  debug(selectedDate);
 }
}
