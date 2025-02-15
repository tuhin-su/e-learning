import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserService } from 'src/app/core/services/user.service';
import QRCode from 'qrcode';
import { firstValueFrom, tap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, HttpClientModule],
})
export class SignInComponent implements OnInit {
  qr_img="";
  key="new";

  constructor(private readonly _router: Router, private readonly _userService: UserService) {}


  ngOnInit(): void {
    this.requstSesstion();
    setInterval(() => {
      this.requstSesstion();
    }, 8000);
  }

  requstSesstion(){
    firstValueFrom(this._userService.getQrKey(this.key).pipe(
      tap(
        (res)=>{
          if (res.key) {
            this.renderQrCode(res.key);
            this.key=res.key;
          }
          if (res.sesstion) {
            console.log(res.sesstion);
          }
          
        }
      )
    ))
  }

  renderQrCode(text:string) {
    if (!text) {
      return
    }
    
    QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 0,
      color: {
        dark: '#536DFE',
        light: '#ffffff'
      }
    }).then((base64DataUrl: string) => {
      this.qr_img = base64DataUrl;
    }).catch((err: any) => {
      console.error('Error generating QR code:', err);
    });
  }
}
