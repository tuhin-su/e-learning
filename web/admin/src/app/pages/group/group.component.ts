import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { Customer, CustomerService, Representative } from '../service/customer.service';
import { Product, ProductService } from '../service/product.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { ManagementService } from '../../services/management.service';
import { AlertService } from '../../services/alert.service';
import { convertToMySQLDate } from '../../utility/function';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-group',
  imports: [
    TableModule,
    ReactiveFormsModule,
    DialogModule,
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
    IconFieldModule
],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class GroupComponent implements OnInit {

    groups: any[] = [];
    totalRecords: any[]=[];
    page: number = 0;  // Start with the first page
    size: number = 15; // Default size (15 records per page)
    hasmoredata:boolean = false;
    loading: boolean = true;
    display: boolean = false;  // Controls dialog visibility
    isEditing: boolean = false;
    groupForm:FormGroup = new FormGroup({});
    loadingService: any;
    stream?:{ lable: String, value: Number }[] = [];
    selectedstream: any;



    constructor(
        private management : ManagementService,
        private fb : FormBuilder,
        private alert: AlertService,
      
    ) {
        this.groupForm = this.fb.group({
            id:[''],
            name: ['', Validators.required],
            description: ['', Validators.required],
            code: ['',],
            label: ['', Validators.required],
            
           
    })    
    }

    ngOnInit() {
        this.fetchgroup(0,15)
    }


    loadUsersLazy(event: any) {
        this.loading = true;
        const { first, rows } = event; // 'first' is the starting index and 'rows' is the number of rows per page
      
        // Make an API call to fetch data based on the pagination parameters
        this.fetchgroup(first, rows).then((data: any) => {
          this.groups = data.groups;
          this.totalRecords = data.totalRecords;
          this.loading = false;
        }).catch(error => {
          console.error("Error loading users:", error);
          this.loading = false;
        });
      }
      

      fetchgroup(current: number, max: number) {
        const payload = {
          current: current,  // current page number or index
          max: max           // number of records per page
        };
      
        return firstValueFrom(this.management.getgroups(payload).pipe(
            tap((response) => {
              if (response) {
                this.loading = false;
                // console.log(response);  // Debugging: check API response
                // Set users and total records from the API response
                this.groups = response;
                this.totalRecords = response.totalRecords;
              }
            }),
            catchError((error) => {
              console.error("Error in fetching user data:", error);
              this.loading = false;
              return of({ groups: [], totalRecords: 0 }); // return an empty array on error to prevent app crash
            })
          )
        );
      }
      

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }



    openEditDialog(group: any, isEditing: boolean = false): void {
        this.isEditing = isEditing;
        this.groupForm.patchValue({
          id:group.id,
          name:group.name,
          description: group.description,
          code:group.code,
          label:group.label,
        });
        this.display = true;  // Show the dialog
        
      }


      

     
      async saveGroup() {
       if(this.isEditing){
        await firstValueFrom(this.management.editGroup(this.groupForm.value).pipe(
            tap(
                (response) => {
                    if(response){
                        this.alert.showSuccessAlert(response.message);
                        this.display =false;
                        this.fetchgroup(0,15);
                    }
                },
                (error) => {
                    this.alert.showErrorAlert(error.error.message);
                }
            )
        ));
        return;
       }

       if(this.groupForm.valid){
        await firstValueFrom(this.management.createGroup(this.groupForm.value).pipe(
          tap(
            (response) => {
              if(response){
                this.alert.showSuccessAlert(response.message);
                this.display = false;
                this.fetchgroup(0,15);
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
    

   

}
