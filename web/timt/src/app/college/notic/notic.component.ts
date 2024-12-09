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
  notices: any[] = [
    { 
      title: "Title",
      description: "Notic",
      date: "Notic",
      host: "Notic",
      user:{
        name: "User",
        group: "NULL",
        image: "sds"
      }

    },
    { 
      title: "Title",
      description: "Notic",
      date: "Notic",
      host: "Notic",
      user:{
        name: "User",
        group: "NULL",
        image: "sds"
      }

    }
  ];

  noticFrom: FormGroup = new FormGroup({});
  selectedFile: File | null = null;   

  constructor(
    private fb: FormBuilder,
    private postService: FunctionaltyService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    this.noticFrom = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      uploadId: ['']
    });

  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
      this.uploadFile();
    }
  }

  onSubmit() {
    if (this.noticFrom.valid) {
      console.log(this.noticFrom.value);
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
  }
}
