import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/service/login/login.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('bounceUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]

})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm?: FormGroup;
  loginServiceHolder?: any;
  errorMessage?: string;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    if (this.loginServiceHolder) {
      this.loginServiceHolder.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.loginForm && this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.loginServiceHolder = this.loginService.login(username, password).subscribe(
        (response: any) => {
          if (response.token && response.group) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('group', response.group);
            if (response.info) {
                localStorage.setItem('info',JSON.stringify(response.info))
                this.router.navigate(['/']);
            }
            else{
              this.router.navigate(['/me_data']);
            }
          }
        },
        (error: any) => {
          this.errorMessage = 'Login failed';
        }
      );
    } else {
      this.errorMessage = 'Form is invalid';
    }
  }
}
