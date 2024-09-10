import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, tap } from 'rxjs';
import { FunctionaltyService } from '../../services/functionalty.service';
import { CollegeService } from '../../services/college.service';
import { AlertService } from '../../services/alert.service';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-classes',
  imports: [ReactiveFormsModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent {
  allClassesView:boolean = false;
  createClassView: boolean = false;
  selectedFile: File | null = null;              // Holds the selected file
  uploadId: number = 0; 
  progress?:{value: number};

  // userInfo
  label :string | null = localStorage.getItem('lable');
  
  // class from
  calssForm?: FormGroup;
  
  constructor(
    private postService: FunctionaltyService,
    private fb: FormBuilder,
    private service: CollegeService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    this.fetchClasses();
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
    this.calssForm = this.fb.group({
      content_id: [''],
      title: ['', Validators.required],
      stream: ['', Validators.required],
      semester: ['', Validators.required],
      description: ['']
    });

    this.createClassView = !this.createClassView;
    if (!this.createClassView) {
      this.fetchClasses();
    }
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
    this.alertService.showWarningAlert("Please fill all the fields");
  }
 }
}
