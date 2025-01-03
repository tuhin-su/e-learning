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
import { compareObjectsAndReturnSecondValue, convertToMySQLDate, debug, getInvalidFields } from '../utility/function';
import { LoadingService } from '../services/loading-service.service';
import { GlobalStorageService } from '../services/global-storage.service';
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
  profileForm: FormGroup = new FormGroup({});
  imageSrc: string | ArrayBuffer | null = null;
  userInfo: any = null;
  update: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userInfoService: UserService,
    private alertService: AlertService,
    private loadingService:LoadingService,
    private golbalStorageService: GlobalStorageService
  ) {
    this.userInfo = this.golbalStorageService.get('info');
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
      img: ['', Validators.required]
    });

    if (this.userInfo) {
      this.update = true;
      this.profileForm.patchValue(this.userInfo);
      this.imageSrc = this.userInfo.img;
      this.profileForm.patchValue({
        dob: new Date(this.userInfo.birth)
      })
    }
  }

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      try {
        // Load the image file and perform face detection
        const image = await this.loadImage(file);
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks();
  
        if (detection) {
          // Get the face detection box
          const { x, y, width, height } = detection.detection.box;
  
          // Add padding to the bounding box to include more area like neck and ears
          const padding = 50; // Adjust the padding as needed
          const paddedX = Math.max(x - padding, 0); // Ensure we don't go out of bounds
          const paddedY = Math.max(y - padding, 0);
          const paddedWidth = width + 2 * padding; // Increase width
          const paddedHeight = height + 2 * padding; // Increase height
  
          // Create a canvas for cropping and circular masking
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
  
          if (ctx) {
            // Step 1: Draw the cropped image onto the canvas
            ctx.drawImage(image, paddedX, paddedY, paddedWidth, paddedHeight, 0, 0, 400, 400);
  
            // Step 2: Create a circular mask
            ctx.globalCompositeOperation = 'destination-in'; // Use destination-in to crop into a circle
            ctx.beginPath();
            ctx.arc(200, 200, 200, 0, Math.PI * 2); // Circle in the center
            ctx.closePath();
            ctx.fill();
  
            // Step 3: Convert the canvas to a PNG data URL
            this.imageSrc = canvas.toDataURL('image/png');
  
            // Step 4: Update the form with the new profile image
            if (this.profileForm) {
              this.profileForm.patchValue({
                img: this.imageSrc
              });
            }
          }
        } else {
          this.alertService.showErrorAlert('No face detected chose another image', false);
        }
      } catch (error) {
        console.error('Error processing the file:', error);
        this.alertService.showErrorAlert('An error occurred while processing the image.', false);
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
                  this.golbalStorageService.set('info', this.profileForm?.value);
                  this.router.navigate(['/']);
                }
              },
              (err) => {
                this.alertService.showErrorAlert(err.error.message);
              }
            )
          ));
        } else {
          await firstValueFrom(this.userInfoService.updateInfo(compareObjectsAndReturnSecondValue(this.profileForm.value, this.userInfo)).pipe(
            tap(
              (res) => {
                if (res) {
                  this.alertService.showSuccessAlert('Profile updated successfully', false, this.onOkError.bind(this));
                }
              },
              (err) => {
                this.alertService.showErrorAlert(err.error.message);
              }
            )
          ));
        }
      } catch (error) {
        console.error('Submission error:', error);
      }
    } else {
      this.alertService.showErrorAlert('Plese fill all fields and select an Your image. also make sure your face is in the image properly and clearly visible', false);
    }
    this.loadingService.hideLoading();
  }

  logout() {
    this.router.navigate(['/logout']);
  }
  onOkError() {
    this.golbalStorageService.set('info', this.profileForm?.value);
  }
}
