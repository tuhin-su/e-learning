import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NoticCardComponent } from '../../components/notic-card/notic-card.component';
import { FunctionaltyService } from '../../services/functionalty.service';
import { AlertService } from '../../services/alert.service';
import { firstValueFrom, tap } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CollegeService } from '../../services/college.service';
import { GlobalStorageService } from '../../services/global-storage.service';
import { getInvalidFields } from '../../utility/function';

@Component({
  selector: 'app-notic',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NoticCardComponent,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './notic.component.html',
  styleUrls: ['./notic.component.scss']
})
export class NoticComponent implements OnInit {
  switchView: boolean = false;
  notices: any[] = [];

  noticFrom: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  lable?: string;

  constructor(
    private fb: FormBuilder,
    private postService: FunctionaltyService,
    private alertService: AlertService,
    private collageService: CollegeService,
    private storage: GlobalStorageService
  ) { }
  
  

  ngOnInit(): void {
    this.lable = this.storage.get('lable');

    this.noticFrom = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      uploadId: [null]
    });

    this.fetchAllnotic();

  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
      this.uploadFile();
    }
  }

  async onSubmit() {
    if (this.noticFrom.valid) {
      await firstValueFrom(this.collageService.createNotic(this.noticFrom.value).pipe(
        tap(
          (response) => {
            this.alertService.showSuccessAlert(response.message);
          },
          (error) => {
            this.alertService.showWarningAlert(error.error.message);
          }
        )
      ))
    }else{
      const field = getInvalidFields(this.noticFrom!);
      this.alertService.showWarningAlert('' + field[0] + ' is invalid');
    }
  }

  createNotic() {
    this.switchView = !this.switchView;
  }

  async uploadFile() {
    if (this.selectedFile) {
      await firstValueFrom(this.postService.postPost(this.selectedFile).pipe(
        tap(
          (response) => {
            if (response.post_id) {
              this.noticFrom?.patchValue({
                uploadId: response.post_id
              });
            }
          },
          (error) => {
            console.error(error);
            this.alertService.showWarningAlert(error.error.message);
          }
        )
      ));
    }
  }

  switchViewe() {
    this.switchView = !this.switchView;
    if (!this.switchView) {
      this.fetchAllnotic();
    }
  }

  //  fetchAllnotic
  async fetchAllnotic() {
    await firstValueFrom(this.collageService.getAllNotic().pipe(
      tap(
        (response) => {
          if (response) {
            this.notices = response;
          }
        },
        (error) => {
          this.alertService.showWarningAlert(error.error.message);
        }
      )
    ));
  }
}
