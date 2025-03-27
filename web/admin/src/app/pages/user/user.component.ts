
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagementService } from '../../services/management.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DropdownModule } from 'primeng/dropdown';
import { group } from '@angular/animations';



@Component({
  selector: 'app-user',
  imports: [
    TableModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule],
    
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [ConfirmationService, MessageService,ManagementService]
})
export class  UserComponent implements OnInit {


  users: any[] = [];
  page: number = 1;  // Start with the first page
  size: number = 15; // Default size (15 records per page)
  hasmoredata:boolean = false;
  loading: boolean = true;
  display: boolean = false;  // Controls dialog visibility
  isEditing: boolean = false;
  userForm:FormGroup = new FormGroup({});
  loadingService: any;
  stream?:{ lable: String, value: Number }[] = [];
  selectedstream: any;
  totalRecords: any[] =[];

    constructor(
       private management : ManagementService,
       private fb : FormBuilder,
       private alert: AlertService
    ) {
      this.userForm = this.fb.group({
        id:[''],
        img:['', Validators.required],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        birth: ['', Validators.required],
        email: ['', Validators.required],
        gender: ['', Validators.required],
        address: ['', Validators.required],
        groups : ['',Validators.required],
        status: ['', [Validators.required, Validators.min(0)]],
      });
      
    }

    ngOnInit() {
      this.getCourses(),
      this.fetchUser(0,15);
    }

    loadUsersLazy(event: any) {
      this.loading = true;
      const { first, rows } = event; // 'first' is the starting index and 'rows' is the number of rows per page
    
      // Make an API call to fetch data based on the pagination parameters
      this.fetchUser(first, rows).then((data: any) => {
        this.users = data.users;
        this.totalRecords = data.totalRecords;
        this.loading = false;
      }).catch(error => {
        console.error("Error loading users:", error);
        this.loading = false;
      });
    }
    
    fetchUser(current: number, max: number) {
      const payload = {
        current: current,  // current page number or index
        max: max           // number of records per page
      };
    
      return firstValueFrom(
        this.management.getUserInfo(payload).pipe(
          tap((response) => {
            if (response) {
              this.loading = false;
              console.log(response);  // Debugging: check API response
              // Set users and total records from the API response
              this.users = response;
              this.totalRecords = response.totalRecords;
            }
          }),
          catchError((error) => {
            console.error("Error in fetching user data:", error);
            this.loading = false;
            return of({ users: [], totalRecords: 0 }); // return an empty array on error to prevent app crash
          })
        )
      );
    }
    

    openEditDialog(user: any, isEditing: boolean = false): void {
        this.isEditing = isEditing;
        this.userForm.patchValue({
          id:user.id,
          img : user.img,
          name:user.name,
          phone: user.phone,
          gender: user.gender,
          address:user.address,
          groups:user.group,
          status:user.status
        });
        this.display = true;  // Show the dialog
        this.getCourses();
      }

      selectCourse(event: any){
        this.userForm.patchValue({
          "course_id" : event.value,
         
        })
        console.log(event);
       
      }

      async getCourses(){
        await firstValueFrom(this.management.getStreamInfo().pipe(
          tap(
            (res)=>{
              if(res){
                   this.stream = res
              }
            }
          )
        ));
      }

     
      async saveStudent() {
       if(this.isEditing){
        await firstValueFrom(this.management.editStudent(this.userForm.value).pipe(
            tap(
                (response) => {
                    if(response){
                        this.alert.showSuccessAlert(response.message);
                        this.display =false;
                        // this.fetchUser();
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ));
        return;
       }

        this.display = false;
      }
    

    async deleteStudent(student: any) {
        await firstValueFrom(this.management.deleteStudent(student.id).pipe(
            tap(
                (response) => {
                    if(response){
                        this.alert.showSuccessAlert(response.message);
                        // this.fetchUser();
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ))
    }


}
