import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { firstValueFrom, tap } from 'rxjs';
import { LoadingService } from '../../../services/loading-service.service';
@Component({
  selector: 'app-change-password',
  imports: [
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'] // Fixed this
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  timer: any;
  minutes: number = 10; // Timer in minutes (you can change this as per your needs)
  seconds: number = 0;
  isTimeout: boolean = false;
  otpSendForm: FormGroup | undefined; // Corrected typo here

  otpFild: boolean = false;
  matchPassword: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private userService: UserService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  initializeForm(): void {
    this.otpSendForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
      confirm_password: ['', Validators.required],
      otp: ['', Validators.required],
      otp_token: ['']
    });

    // Add custom validator to match password and confirm_password
    this.otpSendForm.get('confirm_password')?.setValidators([
      Validators.required,
      this.passwordMatchValidator.bind(this)
    ]);
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        clearInterval(this.timer);
        this.isTimeout = true;
      }
    }, 1000); // Decrease every second
  }

  resendOtp(): void {
    this.sendOTP();
    this.resetTimer();
  }

  resetTimer(): void {
    this.minutes = 1;
    this.seconds = 0;
    this.isTimeout = false;
    this.startTimer(); // Restart the timer
  }

  onOkError(){
    this.router.navigate(['/login']);
  }

  async onSubmit() {
    this.loadingService.showLoading();
    if (this.otpSendForm?.valid) {
      await firstValueFrom(this.userService.changepasswd(this.otpSendForm.value).pipe(
        tap(
          (res)=>{
            if(res?.message){
              this.alert.showSuccessAlert(res.message, false, this.onOkError.bind(this))
            }
          },
          (error)=>{
            this.alert.showErrorAlert(error.error.message);
            this.loadingService.hideLoading()
          }
        )
      ))
    }
    this.loadingService.hideLoading()
  }

  async sendOTP(){
    this.loadingService.showLoading()
    if (this.otpSendForm && this.otpSendForm.value["email"] != "") {
      await firstValueFrom(this.userService.sendOTP(this.otpSendForm.value["email"]).pipe(
        tap(
          (res)=>{
            if (res.otp_token) {
              this.otpSendForm?.patchValue(res)
            }else{
              this.alert.showErrorAlert(res.message)
              this.otpSendForm?.reset()
            }
          },
          (error)=>{
            this.loadingService.hideLoading()
            this.alert.showErrorAlert(error.error.message)
            this.otpSendForm?.reset()
          }
        )
      ));
    }
    this.loadingService.hideLoading()
  }
  onInputChange(): void {
    if (this.otpSendForm) {
      const password = this.otpSendForm.value['password'];
      const confirmPassword = this.otpSendForm.value['confirm_password'];
      // Check if passwords match
      if (password === confirmPassword) {
        this.matchPassword = false;
        
        if (this.otpSendForm.value["email"] != "") {
          this.sendOTP();
          this.otpFild = true;
          this.startTimer();
        }else{
          this.alert.showErrorAlert("Please enter email address");
          this.otpSendForm.reset();
        }
      } else {
        this.matchPassword = true;
      }
    }
  }

  // Custom password match validator
  passwordMatchValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = this.otpSendForm?.get('password')?.value;
    if (password && control.value !== password) {
      return { 'passwordMismatch': true };
    }
    return null;
  }
}
