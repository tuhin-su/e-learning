import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GlobalStorageService } from '../../services/global-storage.service';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, FormGroupName, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../services/alert.service';
@Component({
  selector: 'app-securty',
  imports: [
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './securty.component.html',
  styleUrl: './securty.component.scss'
})
export class SecurtyComponent implements OnInit {
  user?: any;
  imgUrl:string = 'img/user-286-512.png';
  passwordFrom?: FormGroup;
  constructor(
    private storage: GlobalStorageService,
    private fb: FormBuilder,
    protected alertService: AlertService
  ){}

  ngOnInit(): void {
    this.init();
    this.user = this.storage.get('info');
    if (this.user.img != '') {
      this.imgUrl = this.user.img;
    }
  }

  init(){
    this.passwordFrom = this.fb.group({
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  }

  onSubmit(){
    if (this.passwordFrom?.valid) {
      if (this.passwordFrom.value['password'] == this.passwordFrom.value['confirm_password']) {
        this.alertService.showSuccessAlert('Do you want save password?', true, )
      }else{
        this.alertService.showWarningAlert("Password and Confirm Password not match!")
      }
    }
  }
  onOk(){
    if (this.passwordFrom?.valid) {
      console.log(this.passwordFrom.value)
    }
  }
}
