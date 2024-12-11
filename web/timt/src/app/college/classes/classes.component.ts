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
import { convertToISODate, convertToMySQLDate, debug, getInvalidFields } from '../../utility/function';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
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
  semester:any = [];
  stream: any = [];

  // userInfo
  label :string | null = localStorage.getItem('lable');

  // class from
  calssForm?: FormGroup;

  cardData:any = [];
  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
    return (date || today) <= today; // Allow dates less than or equal to today
  };

  // curent timestarp
  date:string =  new Date().toISOString();

  constructor(
    private postService: FunctionaltyService,
    private fb: FormBuilder,
    private service: CollegeService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.fetchClasses(this.date);
    if (this.label == "1" || this.label == "2") {
      this.fetchStream();
    }
  }

  async fetchClasses(date:string){
    await firstValueFrom(this.service.getAll(convertToMySQLDate(date)).pipe(
      tap(
        (response)=>{
          if (response) {
            this.cardData = response;
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
        this.fetchClasses(this.date);
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
    const field = getInvalidFields(this.calssForm!);
    this.alertService.showWarningAlert('' + field[0] + ' is invalid');
  }
 }

 selectSem(value: any){
  this.calssForm?.patchValue({semester: value});
 }
 selectStream(value: any){
  this.calssForm?.patchValue({stream: value});
  this.fetchSemester(value);
 }

 onDateChange(selectedDate: Date | null): void {
  this.date = selectedDate?.toISOString() || '';
  this.fetchClasses(this.date);
 }

 async fetchStream(){
  await firstValueFrom(this.service.getStreamInfo().pipe(
    tap(
      (responce)=>{
        responce.map((stream: any)=>{
          this.stream?.push({lable: stream.name, value: stream.id})
        })
      }
    )
  ))
 }

 async fetchSemester(value: any){
  await firstValueFrom(this.service.getInfoSem(value).pipe(
    tap(
      (responce)=>{
        for(let i = 1; i <= Number(responce['course_duration'])*2; i++){
          this.semester?.push({lable: i, value: i})
        }
      }
    )
  ))
 }
}
