import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { AlertService } from '../services/alert.service';
import { debug } from '../utility/function';
import { convertToMySQLDate } from '../utility/function';
import { convertToISODate } from '../utility/function';
@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileForm: any = null;
  imageSrc: string | ArrayBuffer | null = null; // For image preview
  userInfo: any = localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')!) : null
  update:boolean = false;
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userInfoService: UserService,
    private alertService: AlertService
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
      dob: [Date, Validators.required],
      img: ['']
    });

    if (this.userInfo) {
      this.update = true;
      this.profileForm.patchValue(this.userInfo)
      // this.profileForm.patchValue({dob: convertToISODate(this.userInfo.dob)});
      this.imageSrc = this.userInfo.img
    }
    
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
        this.alertService.showErrorAlert("Faild Upload profile",false)
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  

  async onSubmit() {
   debug(this.profileForm.valid)
    if (this.profileForm != null) {
      if (!this.profileForm.valid) {
       debug("From are invalid")
        return;
      }
      await this.profileForm.patchValue({ dob : convertToMySQLDate(this.profileForm.value.dob)});
      debug(this.profileForm.value)
      if (!this.update) {
        await firstValueFrom(this.userInfoService.postInfo(this.profileForm.value).pipe(
          tap(
            (res)=>{
              if (res) {
                localStorage.setItem('info', JSON.stringify(this.profileForm.value))
                this.router.navigate(['/'])
              }
            },
            (err)=>{
             debug(err)
              this.alertService.showErrorAlert(err.error.message)
            }
          )
        ))
      }
      else{
        this.alertService.showErrorAlert("Update info are disibaled")
      }
     
    }
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}
