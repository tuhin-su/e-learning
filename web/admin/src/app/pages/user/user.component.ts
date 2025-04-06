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
import { catchError, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DropdownModule } from 'primeng/dropdown';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { convertToISODate, convertToMySQLDate } from '../../utility/function';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ScrollerModule } from 'primeng/scroller';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-user',
  imports: [
    TableModule,
    ReactiveFormsModule,
    DialogModule,
    AvatarModule,
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
    IconFieldModule,
    ScrollerModule
  ],
    
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [ConfirmationService, MessageService,ManagementService,DatePipe]
})
export class  UserComponent implements OnInit {


  users: any[] = [];
  page: number = 0;  // Start with the first page
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

  itemCount = 0;

    constructor(
       private management : ManagementService,
       private fb : FormBuilder,
       private alert: AlertService,
       private datepipe: DatePipe
    ) {
      this.userForm = this.fb.group({
        id:[''],
        img:['',],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        birth: ['', Validators.required],
        email: ['', Validators.required],
        passwd:[''],
        gender: ['', Validators.required],
        address: ['', Validators.required],
        groups : ['',Validators.required],
        status :[Validators.required]
        
      });
      
    }

    ngOnInit() {
      
      this.fetchUser();
    }


    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }






  exportToExcel(): void {
    if(!this.users){
      return;
    }
    const filteredUsers = this.users.map(user => ({
      'Name': user.name,
      'Email': user.email,
      'Group': user.groups,
      'Address':user.address,
      'Phone number': user.phone
    }));
  const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'users');

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  saveAs(blob, 'users.xlsx');
}
    



     async fetchUser() {
      this.loading = true;
      const payload = {
        current: this.users.length,
        max: this.size
      };
    
      await firstValueFrom(
        this.management.getUserInfo(payload).pipe(
          tap((response) => {
            if (response) {
              this.loading = false;
              this.users.concat(response)
              this.totalRecords = response.totalRecords;
            }
          }),
          catchError((error) => {
            console.error("Error in fetching user data:", error);
            this.loading = false;
            return of({ users: [], totalRecords: 0 });
          })
        )
      );
    }
    
    // Thu, 12 Dec 2024 00:00:00 GMT


    openEditDialog(user: any, isEditing: boolean = false): void {
        this.isEditing = isEditing;
        const convert_birth =convertToMySQLDate(user.birth)
        this.userForm.patchValue({
          id:user.user_id,
          img : user.img,
          name:user.name,
          phone: user.phone,
          gender: user.gender,
          address:user.address,
          birth:convert_birth  , 
          email: user.email,
          groups:user.groups,
          status: user.status,
          
        });
        this.display = true;  // Show the dialog
        
      }


      

     
      async saveUser() {
       if(this.isEditing){
        await firstValueFrom(this.management.editUser(this.userForm.value).pipe(
            tap(
                (response) => {
                    if(response){
                        this.alert.showSuccessAlert(response.message);
                        this.display =false;
                        this.fetchUser();
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ));
        return;
       }

       if(this.userForm.valid){
        await firstValueFrom(this.management.createUser(this.userForm.value).pipe(
          tap(
            (response) => {
              if(response){
                this.alert.showSuccessAlert(response.message);
                this.display = false;
                this.fetchUser();
              }
            },
            (error) => {
              this.alert.showErrorAlert(error.error.message);
            }
          )
        ))
       }
        
        this.display = false;
      }
    

  
      async deleteUser(user: any) {
        await firstValueFrom(this.management.deleteUser(user.user_id).pipe(
            tap(
                (response) => {
                    if(response){
                        this.alert.showSuccessAlert(response.message);
                        this.fetchUser();
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ))
    }
    
    onScroll(event: any) {
      const {
        first,
        rows
      } = event;
    
      const totalScrolled = first + rows;
    
      if(this.users){
        if (totalScrolled >= this.users.length) {
          console.log("📦 Reached end of scroll!");
          this.fetchUser()
        }
      }
    }

}