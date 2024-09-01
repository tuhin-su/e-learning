import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { UserInfomationService } from 'src/service/userInfo/user-infomation.service';
import { Routes } from '@angular/router';


@Component({
  selector: 'app-me-data',
  templateUrl: './me-data.component.html',
  styleUrls: ['./me-data.component.scss']
})
export class MeDataComponent implements OnInit {
  profileForm: any = null;
  imageSrc: string | ArrayBuffer | null = null; // For image preview

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userInfoService: UserInfomationService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      img: ['']
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
        this.profileForm.patchValue({
          img: e.target.result
        });
      };
  
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  

  onSubmit() {
    console.log(this.profileForm.valid)
    if (this.profileForm != null) {
      if (!this.profileForm.valid) {
        console.log("From are invalid")
        return;
      }
      firstValueFrom(this.userInfoService.postInfo(this.profileForm.value).pipe(
        tap(
          (res)=>{
            if (res) {
              localStorage.setItem('info', this.profileForm.value)
              this.router.navigate(['/'])
            }
          },
          (err)=>{
            console.log(err)
          }
        )
      ))
    }
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}
