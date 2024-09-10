import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { UserService } from '../services/user.service';
import { debug } from '../utility/function';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, tap } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { GlobalStorageService } from '../services/global-storage.service';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  constructor (
    private service: UserService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private storage: GlobalStorageService
  ) { }

  // veriables
  loginForm?: FormGroup;

  ngOnInit():void {
    if (this.storage.get('token')) {
      this.router.navigate(['/'])
    }
    
    debug("Execute login component");
    
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  async onSubmit(){
    if (this.loginForm?.valid) {
      debug("Submit login form");
      debug(this.loginForm?.value);
      await firstValueFrom(this.service.login(this.loginForm?.value).pipe(
        tap(
          (res) => {
            if (res.token && res.lable) {
              localStorage.setItem('token', res.token);
              this.storage.set('token', res.token);
              localStorage.setItem('lable', res.lable);
              this.storage.set('lable', res.lable);

              if (res.info) {
                  localStorage.setItem('info',JSON.stringify(res.info))
                  this.storage.set('info',res.info)
                  this.router.navigate(['/']);
              }
              else{
                this.alertService.showErrorAlert("Complit your profile", false, this.onOkError.bind(this))
              }
            }
          },
          (error) => {
            this.alertService.showErrorAlert(error.error.message)
          }
        )
      ));
    }
  }

  onOkError(){
    this.router.navigate(['/me_data']);
  }
}
