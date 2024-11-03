import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, tap } from 'rxjs';
import { PostService } from 'src/service/posts/post.service';
import { ClassesService } from 'src/service/classe/classes.service';
import { showSuccessAlert, showWarningAlert } from 'src/app/utils/global-functions';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
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
    private postService: PostService,
    private fb: FormBuilder,
    private service: ClassesService
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
          showWarningAlert(error.error.message);
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
            showWarningAlert(error.error.message);
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
          showSuccessAlert(response.message);
        },
        (error)=>{
          showWarningAlert(error.error.message);
        }
      )
    ))
  }
  else{
    showWarningAlert("Please fill all the fields");
  }
 }
}
