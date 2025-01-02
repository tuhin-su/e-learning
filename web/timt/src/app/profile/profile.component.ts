import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import * as faceapi from 'face-api.js';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { convertToMySQLDate, debug, getInvalidFields } from '../utility/function';
import { LoadingService } from '../services/loading-service.service';
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
  profileForm?: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  userInfo: any = localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')!) : null;
  update: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userInfoService: UserService,
    private alertService: AlertService,
    private loadingService:LoadingService
  ) {
    this.init();
  }

  async ngOnInit(): Promise<void> {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  }

  init() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      img: ['']
    });

    if (this.userInfo) {
      debug(this.userInfo);
      this.update = true;
      this.profileForm.patchValue(this.userInfo);
      this.imageSrc = this.userInfo.img;
      this.profileForm.patchValue({
        dob: new Date(this.userInfo.birth)
      })
      console.log(this.profileForm.value);
    }
  }

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const image = await this.loadImage(file);

      const detection = await faceapi.detectSingleFace(image).withFaceLandmarks();

      if (detection) {
        const { x, y, width, height } = detection.detection.box;
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, x, y, width, height, 0, 0, 100, 100);

          this.imageSrc = canvas.toDataURL('image/png');
         if (this.profileForm) {
            this.profileForm.patchValue({
              img: this.imageSrc
            });
            debug(this.profileForm.value);
         }
        }
      } else {
        this.alertService.showErrorAlert('No face detected', false);
      }
    }
  }

  loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;
        img.onload = () => resolve(img);
        img.onerror = reject;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async onSubmit() {
    this.loadingService.showLoading();
    if (this.profileForm && this.profileForm.valid) {
      this.profileForm.patchValue({
        "dob": convertToMySQLDate(this.profileForm.value.dob)
      })
      try {
        if (!this.update) {
          await firstValueFrom(this.userInfoService.postInfo(this.profileForm.value).pipe(
            tap(
              (res) => {
                if (res) {
                  localStorage.setItem('info', JSON.stringify(this.profileForm?.value));
                  this.router.navigate(['/']);
                }
              },
              (err) => {
                this.alertService.showErrorAlert(err.error.message);
              }
            )
          ));
        } else {
          this.alertService.showErrorAlert('Update info is disabled');
        }
      } catch (error) {
        console.error('Submission error:', error);
      }
    } else {
      const field  = getInvalidFields(this.profileForm!);
      this.alertService.showErrorAlert('' + field[0] + ' is invalid');
    }
    this.loadingService.hideLoading();
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}
